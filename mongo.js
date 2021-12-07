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

let newEntry = {
    "date": new Date(),
    "test": "just another test, adding as random value of the day: " + Math.random()
}

const MAIN = async () => {
    await CLIENT.connect();
    await CLIENT.db("admin").command({ ping: 1 });
    console.log("Connected successfully to MongoDB");


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
    const findResult = await DB.find({ name: { $exists: true } }).toArray();
    return findResult;
}

GO.route('/iot/all').get((req, res) => {
    IOT()
        .then(
            (x) => {
                res.send(x);
            }
        )
        .catch(console.error)
        .finally(() => CLIENT.close());
})

GO.route('/all').get((req, res) => {
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
        { jwt: "blabla" }
    );
})

module.exports = GO;