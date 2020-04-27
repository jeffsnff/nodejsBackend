const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const betaUserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  signupDate: {
    type: Date,
    default: Date.now
  }
})
module.exports = mongoose.model("betaUser", betaUserSchema)