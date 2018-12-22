const Ad = require('../models/Ad')
const User = require('../models/User')
const Mail = require('../services/Mail')

class PurchaseController {
  async store (req, res) {
    /**
     * ad - id do anuncio da intenção de compra
     * content - mensagem que será enviada ao autor do anuncio por email
     */
    const { ad, content } = req.body

    const purchaseAd = await Ad.findById(ad).populate('author')
    const user = await User.findById(req.userId)

    await Mail.sendMail({
      from: '"Rodrigo Lourenço" <lourenco.rs@gmail.com>',
      to: purchaseAd.author.email,
      subject: `Solicitação de compra: ${purchaseAd.title}`,
      template: 'purchase',
      context: { user, content, ad: purchaseAd } // variáveis enviadas para o template
    })

    return res.send()
  }
}

module.exports = new PurchaseController()
