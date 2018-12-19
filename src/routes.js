const express = require('express')

const routes = express.Router()

const authMiddleware = require('./app/middlewares/auth')

// importa o index.js da pasta controllers
const controllers = require('./app/controllers')

routes.post('/users', controllers.UserController.store)
routes.post('/sessions', controllers.SessionController.store)

// aplica o middleware para as rotas a partir desse ponto
routes.use(authMiddleware)

routes.get('/ads', controllers.AdController.index)
routes.get('/ads/:id', controllers.AdController.show)
routes.post('/ads', controllers.AdController.store)
routes.put('/ads/:id', controllers.AdController.update)
routes.delete('/ads/:id', controllers.AdController.destroy)

module.exports = routes
