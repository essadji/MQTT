const { MongoClient } = require("mongodb");
// DON'T FORGET TO INSTALL DEPENDENCIES ("npm install mongodb") !!!

// Connection
const URI = "mongodb://localhost/";
const CLIENT = new MongoClient(URI);
// const DB = CLIENT.db('MyProject').collection('Collection');

let newEntry = {
    "date": new Date()
}

async function main() {
    await CLIENT.connect();
    // establish and verify connection
    await CLIENT.db("admin").command({ ping: 1 });
    console.log("Connected successfully to server");

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
   
    console.log('RESULTS =>', findResult);
   
    // insert
    const insertResult = await DB.insertMany([newEntry]);
   
    console.log('INSERT =>', insertResult);
    
    return 'done.'
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => CLIENT.close());