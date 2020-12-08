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
    const geoJSON = convertData(purpleAirResponse.data);
    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(geoJSON),
    };
    await client.end();
    return response;
};

function convertData(data) {
    let geoJSON = {
        type: 'FeatureCollection',
        features: []
    };
    for (const sensor of data.results) {
        geoJSON.features.push({
            type: 'Feature',
            id: `${sensor.ID}`,
            geometry: {
                type: 'Point',
                coordinates: [sensor.Lon, sensor.Lat]
            },
            properties: {...sensor}
        });
    }
    // BEGIN FAKE DATA
        geoJSON.features.push({
            type: 'Feature',
            id: '99999',
            geometry: {
                type: 'Point',
                coordinates: [-77.46117521084562, 37.56224603471652]
            },
            properties: {
                Label: 'Fake Sensor: GOOD',
                PM2_5Value: `${5}`,
                CorrectedPM2_5Value: null,
                CorrectionMethod: null
            }
        });
        geoJSON.features.push({
            type: 'Feature',
            id: '99998',
            geometry: {
                type: 'Point',
                coordinates: [-77.46117521084562, 37.56382683627568]
            },
            properties: {
                Label: 'Fake Sensor: MODERATE',
                PM2_5Value: `${20}`,
                CorrectedPM2_5Value: null,
                CorrectionMethod: null
            }
        });
        geoJSON.features.push({
            type: 'Feature',
            id: '99997',
            geometry: {
                type: 'Point',
                coordinates: [-77.46117521084562, 37.56532683627568]
            },
            properties: {
                Label: 'Fake Sensor: UNHEALTHY SENSITIVE GROUPS',
                PM2_5Value: `${40}`,
                CorrectedPM2_5Value: null,
                CorrectionMethod: null
            }
        });
        geoJSON.features.push({
            type: 'Feature',
            id: '99996',
            geometry: {
                type: 'Point',
                coordinates: [-77.46117521084562, 37.56682683627568]
            },
            properties: {
                Label: 'Fake Sensor: UNHEALTHY',
                PM2_5Value: `${100}`,
                CorrectedPM2_5Value: null,
                CorrectionMethod: null
            }
        });
        geoJSON.features.push({
            type: 'Feature',
            id: '99995',
            geometry: {
                type: 'Point',
                coordinates: [-77.46117521084562, 37.56832683627568]
            },
            properties: {
                Label: 'Fake Sensor: VERY UNHEALTHY',
                PM2_5Value: `${200}`,
                CorrectedPM2_5Value: null,
                CorrectionMethod: null
            }
        });
        geoJSON.features.push({
            type: 'Feature',
            id: '99994',
            geometry: {
                type: 'Point',
                coordinates: [-77.46117521084562, 37.56992683627568]
            },
            properties: {
                Label: 'Fake Sensor: HAZARDOUS',
                PM2_5Value: `${400}`,
                CorrectedPM2_5Value: null,
                CorrectionMethod: null
            }
        });
        // END FAKE DATA
    return geoJSON;
}

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
