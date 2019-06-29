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

app.get('/users', (req, res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch((e) => {
        res.status(500).send('Internal server error')
    })
})

app.get('/user/:id', (req, res) => {
    const _id = req.params.id
    User.findById(_id).then((user) => {
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.send(user)
    }).catch((e) => {
        res.status(500).send('Internal server error')
    })
})

app.get('/tasks', (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((e) => {
        res.status(500).send('Internal server error')
    })
})

app.get('/task/:id', (req, res) => {
    const _id = req.params.id
    Task.findById(_id).then((task) => {
        if (!task) {
            return res.status(404).send('Task not found')
        }
        res.send(task)
    }).catch((e) => {
        res.status(500).send('Internal server error')
    })
})

app.listen(port, () => {
    console.log('Server is running on port' + port);    
})