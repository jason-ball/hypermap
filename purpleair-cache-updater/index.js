const axios = require('axios').default;
const { Client } = require('pg');

exports.handler = async (event) => {
    const client = new Client();
    await client.connect();
    
    const purpleAirURL = "https://api.purpleair.com/v1/sensors?fields=sensor_index,name,last_seen,latitude,longitude,pm2.5,temperature,humidity&nwlat=39.515599616919&nwlng=-83.80692410526318&selat=36.487457065348174&selng=-75.71614098105748";
    const purpleAirResponse = await axios.get(purpleAirURL, { headers: { "X-API-KEY": process.env.PURPLEAIR_READ_KEY } });
    
    let sensors = buildZippedSensorArray(purpleAirResponse.data.fields, purpleAirResponse.data.data);
    correctSensors(sensors);
    
    for (const sensor of sensors) {
        const sensorTime = new Date(sensor.last_seen * 1000);
        const serverTime = new Date();
        try {
            await client.query({
                text: 'UPDATE purpleair_history h SET end_time = $1 FROM latest_purpleair_data l WHERE h.purpleair_id = l.purpleair_id AND h.time = l.time AND h.purpleair_id = $2 AND l.time < $3',
                values: [sensorTime, sensor.sensor_index, sensorTime]
            });
            await client.query({
                text: 'INSERT INTO "purpleair_history" ("purpleair_id", "time", "pm2_5", "temperature", "humidity", "corrected_pm2_5", "correction_method", "latitude", "longitude", "server_time") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
                values: [sensor.sensor_index, sensorTime, sensor['pm2.5'], sensor.temperature, sensor.humidity, sensor.CorrectedPM2_5Value, sensor.CorrectionMethod, sensor.latitude, sensor.longitude, serverTime]
            });
        } catch (err) {
            console.error(err.stack);
        }
    }
    
    await client.query(`DELETE FROM "purpleair_history" WHERE "time" < NOW() - interval '7 days'`);
    
    await client.end();
    return "OK";
};

function buildZippedSensorArray(keys, values) {
    let r = [];
    values.forEach(sensor => {
        let s = {};
        sensor.forEach((value, index) => {
            s[keys[index]] = value;
        });
        r.push(s);
    });
    return r;
}

function correctSensors(sensors) {
    // PM2.5 = 0.38*PM2.5 + 2.94
    // PM2.5 = 0.39*PM2.5 + 0.0024*T - 0.050*RH + 5.19
    for (let sensor of sensors) {
        if (sensor['pm2.5'] && sensor.temperature && sensor.humidity) {
            sensor.CorrectedPM2_5Value = (0.39 * sensor['pm2.5']) + (0.0024 * sensor.temperature) - (0.050 * sensor.humidity) + 5.19;
            sensor.CorrectionMethod = 'T & RH';
        } else if (sensor['pm2.5']) {
            sensor.CorrectedPM2_5Value = (0.38 * sensor['pm2.5']) + 2.94;
            sensor.CorrectionMethod = 'Linear';
        } else {
            sensor.CorrectedPM2_5Value = null;
            sensor.CorrectionMethod = null;
        }
    }
}