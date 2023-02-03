const express = require('express')
const accRoute = express.Router()
const bcrypt = require('bcrypt')
const { UserValidator, User } = require('../models/User')
const { asyncMiddleware } = require('../middlewares/asyncMiddleware')
const decodeMiddleware = require('../middlewares/decode')
const { Profile, profileValidator } = require('../models/Profile')

accRoute.post('/registration', asyncMiddleware( async (req, res,next) => {
        let {error}=UserValidator.validate(req.body)
        if (error) {
            next(error.details[0].message)
        }
        let checkingUser= await User.findOne({username:req.body.username})
        if (checkingUser) {
            return res.json({"message":"user already exists"})
        }
        let user= new User(req.body)
        const salt = await bcrypt.genSalt(10)
        let hash = await bcrypt.hash(user.password,salt)
        user.password=hash
        await user.save()
        let token=user.genToken()
        return res.json({"auth_token":token})
        }
));



accRoute.post('/login', asyncMiddleware(async (req, res,next) => {
    let user=await User.findOne({username: req.body.username})
    if(!user){
        return res.json({"message": "User not found"})
    }

    console.log(user)
    const result = await bcrypt.compare(req.body.password,user.password);
    if(!result){
        return res.json({"message":"Incorrect details"})
    }
    return res.json({"auth_token":user.genToken()})
}))


accRoute.post('/profile',[decodeMiddleware],asyncMiddleware(async (req, res,next) => {
    let {error}=profileValidator.validate(req.body)
    if (error) {
        next(error.details[0].message)
    }
    let profile=new Profile(req.body)
    profile.user = req.user_id
    await profile.save()
    res.json(profile)

}))

accRoute.get('/profile',[decodeMiddleware],asyncMiddleware(async (req, res,next) => {
    let profile=await Profile.findOne({user:req.user_id}).populate('user')
    res.json(profile)
}))

accRoute.put('/profile',[decodeMiddleware],asyncMiddleware(async (req, res,next) => {
    let profile=await Profile.findOneAndUpdate({user:req.user_id},req.body,{new:true})
    res.json(profile)

}))



module.exports = accRoute
