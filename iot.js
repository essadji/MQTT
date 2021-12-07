//#region MQTT
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
//#endregion MQTT
/////////////////// 
//#region // MONGO //
/////////////////////
const X = require('express');
const GO = X.Router();
const { MongoClient } = require("mongodb");
const URI = "mongodb://localhost/";
const CLIENT = new MongoClient(URI);
////////////////////////
//#endregion // MONGO //

let newEntry = {
    "date": new Date(),
    "test": "just another test, adding as random value of the day: " + Math.random()
}

//#region MQTT CODE
client.on('connect', () => {
    console.log('Connected')
    client.subscribe([TOPIC], () => {
        console.log(`Subscribe to TOPIC '${TOPIC}'`)
    })
})
client.on('message', (TOPIC, payload) => {
    mqttData.push(payload.toString());
    // insert
    const insertResult = await DB.insertMany([payload]);
    console.log('INSERT =>', insertResult);
    // console.log('Received Message:', TOPIC, payload.toString())
})
//#endregion MQTT CODE
//////////////////////////
async function main() {
    await CLIENT.connect();
    await CLIENT.db("admin").command({ ping: 1 });
    console.log("Connected successfully to MongoDB");

    const DB = CLIENT.db('MyProject').collection('Collection');

    // find all
    const findResult = await DB.find({}).toArray();

    // find some
    // const findResult = await DB.find({
    //  name: "Lemony Snicket",
    //  date: {
    //      $gte: new Date(new Date().setHours(00, 00, 00)),
    //      $lt: new Date(new Date().setHours(23, 59, 59)),
    //  },
    // });

    // console.log('RESULTS =>', findResult);

    // insert
    // const insertResult = await DB.insertMany([newEntry]);

    // console.log('INSERT =>', insertResult);

    return findResult;
}
const IOT = async () => {
    await CLIENT.connect();
    await CLIENT.db("admin").command({ ping: 1 });
    console.log("Connected successfully to MongoDB");
    const DB = CLIENT.db('MyProject').collection('Collection');
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
    main()
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