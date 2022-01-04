const mongoose = require("mongoose");

const productScehema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please Enter Item Name"],
        trim:true,
    },
    description:{
        type:String,
        required:[true,"Please Enter Item Description"],
    },
    price:{
        type:Number,
        required:[true,"Please Enter Item Price"],
        maxLength:[8,"Price cannot exceed 8 figures"],
    },
    ratings:{
        type:Number,
        default:0,
    },
     images:[{
         public_id:{
             type:String,
             required:true,
        },
         url:{
             type:String,
           required:true,
          },
     },
    ],
    category:{
        type:String,
        required:[true, "Please Input Item Category"],
    },
    Stock:{
        type:Number,
        required:[true, "Please Enter Available Item Stock"],
        maxLength:[4,"Stock Unit Cannot Exceed Four Characters"],
        default:1,
    },
    numofReviews:{
        type:Number,
        default:0,
    },
    reviews:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"User",
                required:true,
            },
            name:{
                type:String,
                required:true,
            },
            rating:{
                type:Number,
                required:true,
            },
            comment:{
                type:String,
                required:true
            },
        },
    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
});

module.exports = mongoose.model("Product",productScehema);