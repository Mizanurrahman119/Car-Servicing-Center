const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app =express();
const post = 4000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oqk0s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('Express2');
        const serviceCollection = database.collection('Express2');

        // get API
        app.get('/Express2', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // get single service 
        app.get('/Express2/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting spefic service id is:', id);
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.json(service)
        })

        //post API
        app.post('/Express2', async(req, res) => {
            const service = req.body;
            console.log("hit the post api", service);

            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        //delete API
        app.delete('/Express2/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Genius Server');
});

app.listen(post, () => {
    console.log('Running Genius Server in post', post);
});