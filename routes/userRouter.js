const express = require('express')
const userRouter = express.Router()
const betaUser = require('../models/betaUser.js')

// Get All Beta Users
userRouter.get('/', (req, res, next) => {
  betaUser.find((err, users) => {
    if(err){
      res.status(500)
      return next(err)
    }
    return res.status(200).send(users)
  })
})

userRouter.post('/signup', (req, res, next) => {
  const newUser = new betaUser(req.body)

  newUser.save((err, savedUser) => {
    if(err){
      res.status(500)
      return next(err)
    }
    return res.status(201).send(savedUser)
  })
})

module.exports = userRouter