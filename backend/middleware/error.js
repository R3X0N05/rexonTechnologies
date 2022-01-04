const ErrorHandler = require("../utils/errorhandler");

module.exports = (err,req,res,next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";


    // Handling invalid mongodb item id errors
    if(err.name === "CastError"){
        const message = `Item not found. Invalid ${err.path}`;
        err = new ErrorHandler(message, 400);
    }

    //Mongoose Duplicate Key Error Handling
    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
        err = new ErrorHandler(message, 400);
    }

    //Handling Invalid JWT 
    if(err.code === "JsonWebTokenError"){
        const message = `Json Web Token Entered Is Invalid , Please Try Again`;
        err = new ErrorHandler(message, 400);
    }

    //Handling JWT Expire
    if(err.code === "TokenExpiredError"){
        const message = `Json Web Token Entered Has Expired , Please Try Again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};