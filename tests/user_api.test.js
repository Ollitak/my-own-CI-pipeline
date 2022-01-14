const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const supertest = require('supertest')
const app = require('../app')


const api = supertest(app)


describe('when there is initially one user at db', () => {
    beforeEach(async () => {
        await User.deleteMany({})

        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({ username: 'root', passwordHash })

        await user.save()
    })

    test('creation succeeds with a fresh username', async () => {
        const users = await User.find({})
        const usersAtStart = users.map(u => u.toJSON())

        const newUser = {
        username: 'test1',
        name: 'Dalai Lama',
        password: 'secret',
        }

        await api
        .post('/api/users')
        .send(newUser)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        const users2 = await User.find({})
        const usersAtEnd = users2.map(u => u.toJSON())
        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        expect(usernames).toContain(newUser.username)
    })



    test('creation fails with proper statuscode and message if username already taken', async () => {
        const users = await User.find({})
        const usersAtStart = users.map(u => u.toJSON())

        const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        expect(result.body.error).toContain('`username` to be unique')

        const users2 = await User.find({})
        const usersAtEnd = users2.map(u => u.toJSON())
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscod if password too short', async () => {
        const users = await User.find({})
        const usersAtStart = users.map(u => u.toJSON())

        const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 's',
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const users2 = await User.find({})
        const usersAtEnd = users2.map(u => u.toJSON())
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })

    test('creation fails with proper statuscode if no username set', async () => {
        const users = await User.find({})
        const usersAtStart = users.map(u => u.toJSON())

        const newUser = {
        name: 'Superuser',
        password: 's',
        }

        const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

        const users2 = await User.find({})
        const usersAtEnd = users2.map(u => u.toJSON())
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
    })
})



afterAll(() => {
    mongoose.connection.close()
})