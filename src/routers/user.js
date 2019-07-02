const express = require('express');
const router = new express.Router()
const User = require('../models/user');
const auth = require('../middleware/auth');

// Create new user
router.post('/user', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(200).send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/user/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send({user, token})
    } catch (error) {
        res.status(400).send(error)
    }
})

router.post('/user/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token    
        })
        await req.user.save()
        res.send('Logged out successfully')
    } catch (error) {
        res.status(500).send(error)
    }   
})

router.post('/user/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('Logged out successfully from all the devices.')
    } catch (error) {
        res.send(error)
    }   
})

router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
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

router.patch('/user', auth, async (req, res) => {
    const inputFields = Object.keys(req.body)
    const allowedFields = ['age', 'name', 'email', 'password']
    const isValidInput = inputFields.every((field) => allowedFields.includes(field))

    if (!isValidInput) {
        return res.status(400).send('Invalid fields in request body')
    }
    try {
        inputFields.forEach((field) => req.user[field] = req.body[field])
        await req.user.save()

        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.delete('/user', auth, async (req, res) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }  
})

module.exports = router