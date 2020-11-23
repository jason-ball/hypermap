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
    
    for (const sensor of purpleAirResponse.data.results) {
        try {
        await client.query({
            text: 'INSERT INTO "PurpleAirHistory" ("PurpleAirID", "Time", "PM2.5", "Temperature", "Humidity") VALUES ($1, $2, $3, $4, $5)',
            values: [sensor.ID, new Date(sensor.LastSeen * 1000), sensor.PM2_5Value, sensor.temp_f, sensor.humidity]
        });
        } catch (err) {
            console.error(err.stack);
        }
    }
    
    await client.query(`DELETE FROM "PurpleAirHistory" WHERE "Time" < NOW() - interval '7 days'`);
    
    await client.end();
    return "OK";
};

// function convertData(data) {
//     let geoJSON = {
//         type: 'FeatureCollection',
//         features: []
//     };
//     for (const sensor of data.results) {
//         geoJSON.features.push({
//             type: 'Feature',
//             id: `${sensor.ID}`,
//             geometry: {
//                 type: 'Point',
//                 coordinates: [sensor.Lon, sensor.Lat]
//             },
//             properties: {...sensor}
//         });
//     }
//     return geoJSON;
// }