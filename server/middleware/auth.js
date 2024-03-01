const passport = require('passport');
const {ApiError} = require('./apiError');
const httpStatus = require('http-status');

const verify = (req,res,resolve,reject) => async(err,user) => {
    // if there is no user or an error, the returning reject will go to the 'catch' block in the promise
    if(err || !user){
        return reject(new ApiError(httpStatus.UNAUTHORIZED,'Sorry Unauthorized'))
    }
    req.user = user;
    
    // otherwise, the returning resolve will go to the 'then' block in the promise
    resolve();
}

const auth = () => async(req,res,next) => {
    return new Promise((resolve, reject) => {
        // the authenticate function will decode based on jwt and call verify function with the response
        passport.authenticate('jwt',{session:false},verify(req,res,resolve,reject))(req,res,next)    
    })
    .then(()=>next())
    .catch((err)=>next(err))

    
}

module.exports = auth;