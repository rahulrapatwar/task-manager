const express = require('express');
const router = express.Router()
const Task = require('../models/task');
const auth = require('../middleware/auth');

router.post('/task', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(400)
    }
})

router.get('/tasks', auth, async (req, res) => {
    try {
        const tasks = await Task.find({owner: req.user._id})
        res.send(tasks)
    } catch (error) {
        res.status(500).send('Internal server error')
    }
})

router.get('/task/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send('Task not found')
        }
        res.send(task)
    } catch (error) {
        res.status(500).send('Internal server error')
    }
})

router.patch('/task/:id', auth, async (req, res) => {
    const _id = req.params.id
    const inputFields = Object.keys(req.body)
    const allowedFields = ['description', 'completed']
    const isValidInput = inputFields.every((field) => allowedFields.includes(field))

    if (!isValidInput) {
        return res.status(400).send('Invalid fields in request body')
    }
    try {
        const task = await Task.findOne({_id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        inputFields.forEach((field) => task[field] = req.body[field])
        await task.save()
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/task/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
        res.status(500).send(error)
    }  
})

module.exports = router