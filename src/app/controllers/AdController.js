const Ad = require('../models/Ad')

class AdController {
  async index (req, res) {
    const filters = {}

    if (req.query.price_min || req.query.prece_max) {
      filters.price = {}

      if (req.query.price_min) {
        /**
         * operadores do mongoose para querys
         * $gte - greater than or Equal
         */
        filters.price.$gte = req.query.price_min
      }

      if (req.query.price_max) {
        /**
         * operadores do mongoose para querys
         * $lte - less than or Equal
         */
        filters.price.$lte = req.query.price_max
      }
    }

    if (req.query.title) {
      /**
       * O uso da expressão regular é para pesquisar parte do título
       * i - case insentisive
       */
      filters.title = new RegExp(req.query.title, 'i')
    }
    /**
     * Parâmetros do paginate
     * primeiro parâmetro: restrições de pesquisa (where)
     * segundo parâmetro:
     */
    const ads = await Ad.paginate(filters, {
      page: req.query.page || 1,
      limit: 20,
      populate: ['author'], // dados do model relacionado
      sort: '-createdAt'
    })

    return res.json(ads)
  }

  async show (req, res) {
    const ad = await Ad.findById(req.params.id)

    return res.json(ad)
  }

  async store (req, res) {
    const ad = await Ad.create({ ...req.body, author: req.userId })

    return res.json(ad)
  }

  async update (req, res) {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    })

    return res.json(ad)
  }

  async destroy (req, res) {
    await Ad.findByIdAndDelete(req.params.id)

    return res.send()
  }
}

module.exports = new AdController()
