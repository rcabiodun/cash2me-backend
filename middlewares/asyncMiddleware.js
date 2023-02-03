function asyncMiddleware(func){
    return async(req,res,next)=>{
        try {
            await func(req,res,next);
        } catch (error) {
            next(error.message)
        }
    }

}

module.exports.asyncMiddleware =asyncMiddleware