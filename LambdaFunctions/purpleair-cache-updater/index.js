const axios = require('axios').default;
const { Client } = require('pg');

exports.handler = async (event) => {
    const client = new Client();
    await client.connect();
    
    const res = await client.query({
        rowMode: 'array',
        text: 'SELECT "PurpleAirID" FROM "PurpleAirSensor"'
    });
    const sensors = res.rows.flat().join('|');
    const purpleAirResponse = await axios.get(`https://www.purpleair.com/json?show=${sensors}`);
    
    correctSensors(purpleAirResponse.data.results);
    
    for (const sensor of purpleAirResponse.data.results) {
        try {
        await client.query({
            text: 'INSERT INTO "PurpleAirHistory" ("PurpleAirID", "Time", "PM2.5", "Temperature", "Humidity", "CorrectedPM2.5", "CorrectionMethod") VALUES ($1, $2, $3, $4, $5, $6, $7)',
            values: [sensor.ID, new Date(sensor.LastSeen * 1000), sensor.PM2_5Value, sensor.temp_f, sensor.humidity, sensor.CorrectedPM2_5Value, sensor.CorrectionMethod]
        });
        } catch (err) {
            console.error(err.stack);
        }
    }
    
    await client.query(`DELETE FROM "PurpleAirHistory" WHERE "Time" < NOW() - interval '7 days'`);
    
    await client.end();
    return "OK";
};

function correctSensors(sensors) {
    // PM2.5 = 0.38*PM2.5 + 2.94
    // PM2.5 = 0.39*PM2.5 + 0.0024*T - 0.050*RH + 5.19
    for (let sensor of sensors) {
        if (sensor.PM2_5Value && sensor.temp_f && sensor.humidity) {
            sensor.CorrectedPM2_5Value = (0.39 * parseFloat(sensor.PM2_5Value)) + (0.0024 * parseFloat(sensor.temp_f)) - (0.050 * parseFloat(sensor.humidity)) + 5.19;
            sensor.CorrectionMethod = 'T & RH';
        } else if (sensor.PM2_5Value) {
            sensor.CorrectedPM2_5Value = (0.38 * parseFloat(sensor.PM2_5Value)) + 2.94;
            sensor.CorrectionMethod = 'Linear';
        } else {
            sensor.CorrectedPM2_5Value = null;
            sensor.CorrectionMethod = null;
        }
    }
}
