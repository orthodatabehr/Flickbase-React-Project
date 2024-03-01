const mongoose = require('mongoose');
require('dotenv').config();
// install validator package to help check whether input is email 
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        // pass a function as part of the email schema requirements so mongoose can check the email using the validator isEmail function
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true
    },
    role:{
        type:String,
        // enum defines set of expected values for a particular field. e.g. a user can only be user or admin, any other entry will be rejected.
        enum:['user','admin'],
        default:'user'
    },
    firstname:{
        type:String,
        trim:true,
        maxLength:100
    },
    lastname:{
        type:String,
        trim:true,
        maxLength:1000
    },
    age:{
        type:Number
    },
    date:{
        type:Date,
        default:Date.now
    },
    verified:{
        type:Boolean,
        default:false
    }
});

userSchema.pre('save',async function(next){
    let user = this;
    if(user.isModified('password')){
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(user.password,salt);
        user.password = hash;
    }
    next();
})




userSchema.statics.emailTaken = async function(email){
    const user = await this.findOne({email});
    return !!user;
}

userSchema.methods.generateAuthToken = function(){
    let user = this;
    const userObj = {sub:user._id.toHexString(),email:user.email};
    const token = jwt.sign(userObj,process.env.DB_SECRET,{expiresIn:'1d'});
    return token;
}

userSchema.methods.comparePassword = async function(candidatePassword){
    const user = this;
    const match= await bcrypt.compare(candidatePassword,user.password);
    return match;
}


const User = mongoose.model('User',userSchema);
module.exports = {User}