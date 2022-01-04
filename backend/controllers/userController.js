const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");
const cloudinary  = require("cloudinary");

//Register A New User

exports.registerUser = catchAsyncErrors(async(req, res, next) => {
   
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
        folder: "avatars",
        width: 150,
        crop: "scale",
    });
    const { name, email, password} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
            },
        });

        sendToken(user,201,res);

});

// Login User
exports.loginUser = catchAsyncErrors (async (req,res,next)=>{
    const {email,password} = req.body;

    // Credential check
    if(!email || !password){
        return next(new ErrorHandler("Please Enter Valid Email ID and Password",400));
    }
    const user = await User.findOne({ email }).select("+password");

    if(!user){
        return next(new ErrorHandler("Invalid Email ID/Password",401));
    }
    const isPasswordMatched = user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid Email ID/Password",401));
    }

    sendToken(user,200,res);
});


//Logging out User
exports.logout = catchAsyncErrors(async(req,res,next)=>{

    res.cookie("token",null,{
        expires:new Date(Date.now()),
        httpOnly:true,
    });

    res.status(200).json({
        success:true,
        message:"Log out successful"
    });
});

//Forgot Password
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    //Get Token For PasswordReset
    const resetToken = user.getResetPasswordToken();
    await user.save({  validateBeforeSave: false  });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/password/reset/${resetToken}`;

    const message = `Password Reset Token :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this reset email , please ignore or contact support`;

    try {
        await sendEmail({
            email:user.email,
            subject:`Account Password Recovery Email`,
            message,
        });
        res.status(200).json({
            success:true,
            message: `Email has been sent to ${user.email} successfully`,
        });
        
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler(error.message, 500));
    }
});

// Reset Password
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{

    //Creating Token Hash
    const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now() },
    });

    if(!user){
        return next(new ErrorHandler("Reset Password Token Is Invalid Or Expired",400));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("Password Entered Does Not Match",400));

    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

   await user.save();
   sendToken(user, 200, res);

});

// To Get User Information
exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    });

});

// To Update User Password
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id).select("+password");
    
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
  
    if (!isPasswordMatched) {
      return next(new ErrorHandler("The Old Password Entered Is Incorrect", 400));
    }
  
    if (req.body.newPassword !== req.body.confirmPassword) {
      return next(new ErrorHandler("Entered Passwords Do Not Match", 400));
    }
  
    user.password = req.body.newPassword;
  
    await user.save();
  
    sendToken(user, 200, res);
  });

// To Update User Profile
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
    };

    if (req.body.avatar !== ""){
        const user = await User.findById(req.user.id);
        const imageId = user.avatar.public_id;
        await cloudinary.v2.uploader.destroy(imageId);

        const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
            folder: "avatars",
            width: 150,
            crop: "scale",
        });

        newUserData.avatar = {
            public_id: myCloud.public_id,
            url: myCloud.secure_url,
        };
    }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
    });
});

// To get all users for Administrator
exports.getAllUser = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    });
});

// To Get A User Information for Administrator
exports.getAUser = catchAsyncErrors(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

if(!user){
    return next(new ErrorHandler(`User Does Not Exist With ID : ${req.params.id}`));
}

    res.status(200).json({
        success:true,
        user,
    });

});

// To Update User Role By Administrator
exports.updateUserRole= catchAsyncErrors(async (req, res, next) => {
    
    const newUserData = {
      name: req.body.name,
      email: req.body.email,
      role:req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.params.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    });

    res.status(200).json({
        success:true,
    });
});

// To Delete User By Administrator
exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    
   const user = await User.findById(req.params.id);

    
    if(!user){
        return next(new ErrorHandler(`User Does Not Exist With The ID : ${req.params.id}`));
    }

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    await user.remove();
   

    res.status(200).json({
        success:true,
        message:"User has been deleted successfully",
    });
});

