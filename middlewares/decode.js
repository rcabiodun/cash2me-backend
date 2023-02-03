const jwt=require("jsonwebtoken")


let decode=(req,res,next)=>{
    let token=req.headers.authorization
    let result=jwt.verify(token,"cash2me")
    req.user_id=result.id
    next();
}

module.exports =decode