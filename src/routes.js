const express = require('express')

const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')

// importa o index.js da pasta controllers
const controllers = require('./app/controllers')

// const UserController = require('./app/controllers/UserController')
// const SessionController = require('./app/controllers/SessionController')

routes.post('/users', controllers.UserController.store)

routes.post('/sessions', controllers.SessionController.store)

routes.get('/teste', authMiddleware, (req, res) => res.json({ ok: true }))

module.exports = routes
