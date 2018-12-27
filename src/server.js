const express = require('express')
const mongoose = require('mongoose')
const Youch = require('youch')
const Sentry = require('@sentry/node')
const validate = require('express-validation')
const databaseConfig = require('./config/database')
const sentryConfig = require('./config/sentry')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.sentry()
    this.database()
    this.middlewares()
    this.routes()
    this.exception()
  }

  sentry () {
    Sentry.init(sentryConfig)
  }

  database () {
    /*
     * se estiver usando o Atlas, a URI de conexão seria algo como
     * mongodb://usuario:senha@localhost:27017/databasename
     *
     * No docker, por default não vem com usuário e senha.
     * Para ficar mais organizado, será criado um arquivo:
     * config/database.js
     */

    mongoose.connect(
      databaseConfig.uri,
      // instrui o mongoose de que estamos usando a versão mais recente do Node
      {
        useCreateIndex: true,
        useNewUrlParser: true
      }
    )
  }

  middlewares () {
    /**
     * da ao express a possibilidade de ler corpos de requisições
     * e passar para o req.body dentro de cadas midleware
     */
    this.express.use(express.json())
    this.express.use(Sentry.Handlers.requestHandler())
  }

  routes () {
    this.express.use(require('./routes'))
  }

  exception () {
    // if (process.env.NODE_ENV === 'production') {
    this.express.use(Sentry.Handlers.errorHandler())
    // }

    this.express.use(async (err, req, res, next) => {
      // o propósito dessa verificação é formatar os erros de
      // validação no formato json
      if (err instanceof validate.ValidationError) {
        return res.status(err.status).json(err)
      }

      if (process.env.NODE_ENV !== 'production') {
        const youch = new Youch(err, req)

        return res.json(await youch.toJSON())
      }

      return res.status(err.status || 500).json('Internal server error')
    })
  }
}

module.exports = new App().express
