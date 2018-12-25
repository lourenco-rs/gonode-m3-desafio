const Mail = require('../services/Mail')

class PurchaseMail {
  get key () {
    return 'PurchaseMail'
  }

  /**
   * @param job - Tem várias infomações sobre o job
   * @param done Função que deve ser chamada no final do job
   */
  async handle (job, done) {
    const { ad, user, content } = job.data

    await Mail.sendMail({
      from: '"Rodrigo Lourenço" <lourenco.rs@gmail.com>',
      to: ad.author.email,
      subject: `Solicitação de compra: ${ad.title}`,
      template: 'purchase',
      context: { user, content, ad } // variáveis enviadas para o template
    })

    // para finalizar e avisar o job que ele finalizou
    return done()
  }
}

module.exports = new PurchaseMail()
