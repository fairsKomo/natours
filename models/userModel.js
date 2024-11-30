const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is Required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator.isEmail, 'Write a proper email'],
    },
    photo: {
        type: String
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minLength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Confirm Your Password'],

        // This validator will run only at CREATE and SAVE
        validate:{
            validator: function(el){
                return el === this.password;
            },
            message:'Passwords are not the same!!!'
        }
    },
    passwordChangedAt: Date,
})

userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    // Hash the password with the cost 12
    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
})

userSchema.methods.correctPassword = async function(candidate, actual){
    return await bcrypt.compare(candidate, actual);
}

userSchema.methods.changedPasswordAfter = function(JWTTimeStamp){
    if(this.passwordChangedAt){
        const passwordChangedTime = parseInt(this.passwordChangedAt.getTime()/1000, 10);

        return JWTTimeStamp < passwordChangedTime;
    }
    
    return false;
}

const User = mongoose.model('User', userSchema);

module.exports = User;