const Ad = require('../models/Ad')
const User = require('../models/User')
const PurchaseMail = require('../jobs/PurchaseMail')
const Queue = require('../services/Queue')

class PurchaseController {
  async store (req, res) {
    // esse funciona - envia mensagem para o sentry.io
    // throw new Error('erro provocado...')

    /**
     * ad - id do anuncio da intenção de compra
     * content - mensagem que será enviada ao autor do anuncio por email
     */
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    /**
     * Save - para salvar o job no Redis e executar a fila.
     */
    Queue.create(PurchaseMail.key, {
      ad: purchaseAd,
      user,
      content
    }).save()

    return res.send()
  }
}

module.exports = new PurchaseController()
