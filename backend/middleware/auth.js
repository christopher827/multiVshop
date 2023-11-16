const ErrorHandler=require("../utils/ErrorHandler")
const catchAsyncErrors=require("./catchAsyncErrors")
const jwt = require("jsonwebtoken");
const User=require("../models/user")
const Shop=require("../models/shop")


exports.isAuthenticated = catchAsyncErrors(async(req,res,next) => {
    const {token} = req.cookies;
    if(!token){
        return res.status(401).json({message:"Please login to continue"})
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if(!decoded){
        return res.status(401).json({message:"Token is not correct"})
    }
    req.user = await User.findById(decoded.id);//fetching all the user's information from the database based on the user's ID extracted from the decoded JWT
    next();//passing control to the next middleware or route handler in the chain.
});

exports.isSeller = catchAsyncErrors(async(req,res,next) => {
    const {seller_token} = req.cookies;
    if(!seller_token){
        return next(new ErrorHandler("Please login to continue", 401));
    }
    const decoded = jwt.verify(seller_token, process.env.JWT_SECRET_KEY);
    req.seller = await Shop.findById(decoded.id);
    next();
});

exports.isAdmin = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} can not access this resources!`))
        };
        next();
    }
}