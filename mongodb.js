// // const mongodb = require('mongodb');
// // const MongoClient = mongodb.MongoClient;
// // const ObjectID = mongodb.ObjectId;


// const { MongoClient, ObjectId } = require('mongodb');

// const connectionURL = 'mongodb://127.0.0.1:27017';
// const databaseName = 'task-manager';

// // const id = new ObjectId();

// // console.log(id);

// MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
//     if (error) {
//         return console.log('Unable to connect to database');
//     }
//     const db = client.db(databaseName);
//     // insert many object
//     // db.collection('users').insertMany([{
//     //     name: 'Doe',
//     //     age: 30
//     // }, {
//     //     name:'Wow',
//     //     age:10
//     // }], (err, result) =>{
//     //     if(err){
//     //         return console.log('Unable to insert user');
//     //     }
//     // });

//     //insert 1 object
//     // db.collection('users').insertOne({
//     //     name: 'John',
//     //     age: 30
//     // }, (err, result) =>{
//     //     if(err){
//     //         return console.log('Unable to insert user');
//     //     }

//     //     console.log(result);
//     // });

//     // db.collection('tasks').insertMany([
//     //     {
//     //     task: 'Clean house',
//     //     status: 'complete'
//     //     }, {
//     //         task: 'Feed the cow',
//     //         status: 'incomplete'
//     //     }, {
//     //         task: 'Water the plants',
//     //         status: 'complete'
//     //     }
//     // ], (err, result) =>{
//     //     if(err){
//     //         return console.log('Unable to insert user');
//     //     }

//     //     console.log(result);
//     // });


//     //Read data from db

//     //find only

//     // db.collection('users').find({}).toArray().then((res) =>{
//     //     console.log(res);
//     // })


//     // const foundDocs = db.collection('users').find({}).toArray();
//     // foundDocs.then((res) =>{
//     //     console.log(res);
//     // })

//     //callback find
//     // db.collection('tasks').find({}).toArray((err, data) =>{
//     //     console.log(data);
//     // })

//     //findOne
//     // db.collection('tasks').findOne({_id: new ObjectId("61075f0a90e2b0b86b00d548")}, (err, result) => {
//     //     console.log(result);
//     // });

//     //updateOne
//     // db.collection('tasks').updateOne({status: 'complete', task: 'Clean house'}, {$set: {status: 'incomplete'}}).then((res) =>{
//     //     console.log(res);
//     // }).catch(err =>{
//     //     console.log(err);
//     // });

//     //updateMany
//     // db.collection('tasks').updateMany({ status: 'incomplete' }, { $set: { 
//     //     status: 'complete' 
//     //     } 
//     // }).then((res) =>{
//     //     console.log(res);
//     // }).catch((err)=>{
//     //     console.log(err);
//     // })

//     //deleteMany
//     // db.collection('tasks').deleteMany({task: 'Clean house'}).then((res) =>{
//     //     console.log(res);
//     // }).catch((err) =>{
//     //     console.log(err);
//     // })
// });