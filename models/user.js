let mongoose = require('mongoose')

// Article Schema
let userSchema = mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: false
  },
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
  bio: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('User', userSchema)
