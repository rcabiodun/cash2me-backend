const Joi = require("joi");
const mongoose = require("mongoose");
const { User } = require("./User");

let profileSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        unique: true
    },
    user_type:{
        type: String,
        enum:["retailer","wholesaler","dispatch",],
        minLength:4,
        required: true
    },
    hostel:{
        type: String,
        minLength:3,
        required: true
    },

    school:{
        type:String,
        required: true

    },
    rate:{
        type:Number,
    },
    phone_number:{
        type:String,
        required: true
    },
    is_available:{
        type:Boolean,
        default:true
    },
    is_verified:{
        type:Boolean,
        default:true
    }
})

let profile=mongoose.model('profile',profileSchema)

const profileValidator=Joi.object({
    user_type:Joi.string().min(5).required(),
    hostel:Joi.string().min(2).required(),
    school:Joi.string().min(3).required(),
    rate:Joi.number().max(350),
    phone_number:Joi.string().max(11).required(),
})

module.exports.Profile=profile
module.exports.profileValidator=profileValidator