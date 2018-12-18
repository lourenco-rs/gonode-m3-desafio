const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // o email será salvo em minúsculas, mesmo que tenha sido informado em maiúscula
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

UserSchema.pre('save', async function (next) {
  /** usa-se a declaração da function na forma clássica, pois o mongoose
   * da no this a instância com todos os dados do usuário.
   */
  if (!this.isModified('password')) {
    return next()
  }

  /**
   * 8 - representa a força da senha
   */
  this.password = await bcrypt.hash(this.password, 8)
})

module.exports = mongoose.model('User', UserSchema)
