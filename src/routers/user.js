const express = require('express');
const router = new express.Router()
const User = require('../models/user');


router.post('/user', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (error) {
        res.status(500).send('Internal server error')
    }
})

router.get('/user/:id', async (req, res) => {
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

router.patch('/user/:id', async (req, res) => {
    const _id = req.params.id
    const inputFields = Object.keys(req.body)
    const allowedFields = ['age', 'name', 'email']
    const isValidInput = inputFields.every((field) => allowedFields.includes(field))

    if (!isValidInput) {
        return res.status(400).send('Invalid fields in request body')
    }
    try {
        const user = await User.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/user/:id', async (req, res) => {
    const _id = req.params.id
    try {
        const user = await User.findByIdAndDelete(_id)
        if (!user) {
            return res.status(404).send()
        }
        res.send(user)
    } catch (error) {
        res.status(500).send(error)
    }  
})

module.exports = router