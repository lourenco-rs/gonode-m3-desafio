const express = require('express')
const mongoose = require('mongoose')
const databaseConfig = require('./config/database')

class App {
  constructor () {
    this.express = express()
    this.isDev = process.env.NODE_ENV !== 'production'

    this.database()
    this.middlewares()
    this.routes()
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
     * /da ao express a possibilidade de ler corpos de requisições
     * e passar para o req.body dentro de cadas midleware
     */
    this.express.use(express.json())
  }

  routes () {
    this.express.use(require('./routes'))
  }
}

module.exports = new App().express
