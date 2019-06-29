const express = require('express');
require('./db/mongoose')
const User = require('./models/user');
const Task = require('./models/task');

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/user', (req, res) => {
    const user = new User(req.body)
    user.save().then((result) => {
        res.send(result)
    }
    ).catch((error) => {
        res.status(400).send(error)
    })
})

app.post('/task', (req, res) => {
    const task = new Task(req.body)
    task.save().then(() => {
        res.send(task)
    }
    ).catch((e) => {
        res.status(400).send(e)
    })
})

app.listen(port, () => {
    console.log('Server is running on port' + port);    
})