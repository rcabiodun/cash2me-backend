const express = require('express')
const homeRoute = express.Router()
const decodeMiddleware = require('../middlewares/decode')
const { asyncMiddleware } = require('../middlewares/asyncMiddleware')
const { Profile } = require('../models/Profile')

homeRoute.post('/home_page',[decodeMiddleware],asyncMiddleware(async (req, res,next) => {
    console.log(req.query.page)
let cashAgents=await Profile.find().skip((req.query.page - 1) *1).limit(20)
return res.json(cashAgents)
}))

module.exports = homeRoute