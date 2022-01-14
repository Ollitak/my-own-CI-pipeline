const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')



usersRouter.post('/', async (request, response, next) => {
    logger.info("users post request")
    const body = request.body

    if(!body.password || !body.username){
        return response.status(400).send({ error: 'username or password missing...' })
    }
    if(body.password.length < 3){
        return response.status(400).send({ error: 'password has to be at least 3 characters...' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)
    
    const user = new User({
        username: body.username,
        name: body.name,
        passwordHash: passwordHash
    })

    try {
        const savedUser = await user.save()
        response.json(savedUser)
    } catch(e) {
        next(e)
    }
})


usersRouter.get('/', async (request, response) => {
    logger.info("users get request")
    const users = await User
        .find({}).populate('blogs')
    response.json(users)
})


module.exports = usersRouter
