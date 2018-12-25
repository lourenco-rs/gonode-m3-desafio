const jwt = require('jsonwebtoken')
const authConfig = require('../../config/auth')
const { promisify } = require('util')

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  const [, token] = authHeader.split(' ')

  try {
    /** generateTonek ({ id })
     * Na criação do token (model User, generateToken) foi passado o objeto do primeiro parâmetro apenas com o id (jwt.sign({ id })).
     * o decoded recebera um objeto no mesmo formato, com um atributo id
     *
     */
    const decoded = await promisify(jwt.verify)(token, authConfig.secret)

    /**
     * Todo middleware/rota (a partir desse middleware) podera saber qual usuário está fazendo a requisição
     */
    req.userId = decoded.id
    return next()
  } catch (err) {
    return res.status(401).json({ error: 'Token invalid' })
  }
}
