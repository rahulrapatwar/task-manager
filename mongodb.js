const {MongoClient, ObjectID} = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if (error) {
        return console.log("Unable to connect to database");        
    }
    const db = client.db(databaseName)
    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Task one',
    //         completed: false
    //     },
    //     {
    //         description: 'Task two',
    //         completed: true
    //     },
    //     {
    //         description: 'Task three',
    //         completed: true
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log("Failed to insert documents");
    //     }
    //     console.log(result.ops);
    // })
    // update document
    db.collection('tasks').updateOne({
        _id: new ObjectID("5d169dac255709091d25f189")
    }, {
        $set: {
            description: 'Updated task one'
        }
    }).then((result) => {
        console.log(result);
    }).catch((error) => {
        console.log(error);
    }
    )
})