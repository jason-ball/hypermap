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
    return geoJSON;
}