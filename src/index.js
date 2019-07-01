const express = require('express');
require('./db/mongoose')
const User = require('./models/user');
const Task = require('./models/task');

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/user', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

app.post('/task', async (req, res) => {
    const task = new Task(req.body)
    try {
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400)
    }
})

app.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(500).send('Internal server error')
    }
})

app.get('/user/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findById(_id)
        if (!user) {
            return res.status(404).send('User not found')
        }
        res.send(user)
    } catch (error) {
        res.status(500).send('Internal server error')
    }
})

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (error) {
        res.status(500).send('Internal server error')
    }
})

app.get('/task/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findById(_id)
        if (!task) {
            return res.status(404).send('Task not found')
        }
        res.send(task)
    } catch (error) {
        res.status(500).send('Internal server error')
    }
})

app.listen(port, () => {
    console.log('Server is running on port' + port);    
})