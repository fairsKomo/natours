const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const util = require('util');
const signToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRES_IN,
    });
}

exports.signUp = catchAsync(async (req, res, next)=>{
    newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        photo: req.body.photo,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(200).json({
        status: 'Success',
        token,
        data:{
            user: newUser,
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {
    const {email, password} = req.body;

    if(!email || !password) return next(new AppError('Email and Password are required!'));

    const user = await User.findOne({email : email}).select('+password');

    if(!user || (! await user.correctPassword(password, user.password))){
        return next(new AppError('Email or Password is incorrect!'));
    }

    const token = await signToken(user._id);

    res.status(201).json({
        status:'Success',
        token
    })
})

exports.protect = catchAsync(async (req, res, next) => {
    // Getting the Token
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return next(new AppError('Your not logged in! log in first!'), 401);
    }

    // Verify the token
    const decoded = await util.promisify(jwt.verify)(token, process.env.JWT_SECRET); 
    const user = await User.findById(decoded.id);
    if(!user) return next(new AppError('User to this toke is not exsit', 401));

    next();
})