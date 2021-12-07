//#region // MQTT //
////////////////////
const MQTT = require('mqtt')
const MQTT_HOST = 'eu1.cloud.thethings.network'
const MQTT_PORT = '1883'
const MQTT_clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${MQTT_HOST}:${MQTT_PORT}`
const client = MQTT.connect(connectUrl, {
    clientId: MQTT_clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'iot-sensor-frontend-gevorderd@ttn',
    password: 'NNSXS.UGJCMHGZ6FBZN5N3PU2ZDNF4N2BVU7OFA3QBD6Q.IYECKMGUM55OO6K5SHI3VURFRVMHKKAV36TIGATW2VFGLMRJJGZA',
    reconnectPeriod: 1000,
})

const TOPIC = 'v3/#'
///////////////////////
//#endregion // MQTT //

//#region // MONGO //
/////////////////////
const X = require('express');
const GO = X.Router();
const { MongoClient } = require("mongodb");
const URI = "mongodb://localhost/";
const CLIENT = new MongoClient(URI);
const DB = CLIENT.db('MyProject').collection('Collection');
////////////////////////
//#endregion // MONGO //

//#region // MQTT CODE //
/////////////////////////
client.on('connect', () => {
    console.log('Connected')
    client.subscribe([TOPIC], () => {
        console.log(`Subscribe to TOPIC '${TOPIC}'`)
    })
})
client.on('message', async (TOPIC, payload) => {
    // insert
    await CLIENT.connect();
    await CLIENT.db("admin").command({ ping: 1 });
    // console.log(typeof payload) // = buffer UINT8 array
    // const insertResult = await DB.insertMany([JSON.parse(payload.toString())]);
    const insertResult = await DB.insertMany([JSON.parse(payload)]);
    console.log('INSERT =>', insertResult);
})
///////////////////////
//#endregion // MQTT //

const MAIN = async () => {
    await CLIENT.connect();
    await CLIENT.db("admin").command({ ping: 1 });
    console.log("Connected successfully to MongoDB");
    const findResult = await DB.find({}).toArray(); // return all
    return findResult;
}

const IOT = async () => {
    await CLIENT.connect();
    await CLIENT.db("admin").command({ ping: 1 });
    console.log("Connected successfully to MongoDB");
    const findResult = await DB.find({ name: { $exists: true } }).toArray();
    return findResult;
}

GO.route('/all').get((req, res) => {
    IOT()
        .then(
            (x) => {
                res.send(x);
            }
        )
        .catch(console.error)
        .finally(() => CLIENT.close());
})

GO.route('/dump').get((req, res) => {
    MAIN()
        .then(
            (x) => {
                res.send(x);
            }
        )
        .catch(console.error)
        .finally(() => CLIENT.close());
})

GO.route('/json').get((req, res) => {
    let t = Date();
    res.send(
        { test: "hello universe" }
    );
})

GO.route('/string').get((req, res) => {
    res.send("Why, ... hello there, old geezer!");
})

GO.route('/:param').all((req, res) => {
    let p = req.params.param;
    res.send(
        { param: "test" }
    );
})

module.exports = GO;