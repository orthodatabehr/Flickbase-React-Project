const httpStatus = require('http-status');
const {User} = require('../models/user');
const userService = require('./user.service');
const {ApiError} = require('../middleware/apiError')

const createUser = async(email,password)=>{
    try{
        if(await User.emailTaken(email)){
            // create a new class of error to throw to show message and status code using httpStatus
            throw new ApiError(httpStatus.BAD_REQUEST,'Sorry Email Taken')
        }

        const user = new User({
            email,
            password
        });
        await user.save();
        return user;
    } catch(error){
        throw error;
    }
}

const genAuthToken = (user) => {
    const token = user.generateAuthToken();
    return token;
}

const signInWithEmailAndPassword = async(email,password)=>{
    try{
        /// check email exists
        const user = await userService.findUserByEmail(email);
        if (!user){
            throw new ApiError(httpStatus.BAD_REQUEST,'Sorry Bad Email');
        }
        /// validate password
        if(!(await user.comparePassword(password))){
            throw new ApiError(httpStatus.BAD_REQUEST,'Sorry Incorrect Email');
        }
        return user;
    }catch(error){
        throw error
    }
}

module.exports = {
    createUser,
    genAuthToken,
    signInWithEmailAndPassword
}