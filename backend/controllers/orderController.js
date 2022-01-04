const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

//Creating A New Order
exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
    const{shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,} = req.body;

    const order = await Order.create({
        shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice,paidAt: Date.now(),user:req.user._id,  
    });

    res.status(201).json({
        success:true,
        order,
    });
});

//To Get A Single Order
exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
    const order =await Order.findById(req.params.id).populate("user","name email");

    if(!order){
        return next(new ErrorHandler("Order not found with the requested ID",404));
    }

    res.status(200).json({
        success:true,
        order,
    });
});

//To Get A User's Orders
exports.userOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders =await Order.find({user:req.user._id});

    

    res.status(200).json({
        success:true,
        orders,
    });
});

//To Get All Orders (Administrator)
exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders =await Order.find();

    let totalAmount=0;

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    });
    

    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    });
});

//To Update Order Status (Administrator)
exports.updateOrderStatus = catchAsyncErrors(async(req,res,next)=>{
    const order =await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with the requested ID",404));
    }

    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("Your Order Has Been Delivered",400));
    }

    if(req.body.status === "Shipped"){
        order.orderItems.forEach(async (o) => {
         await updateStock(o.product,o.quantity);
        });
    }
    
    order.orderStatus = req.body.status;
    
    if(req.body.status==="Delivered"){
        order.deliveredAt=Date.now();
    }

    await order.save({validateBeforeSave: false});

    res.status(200).json({
        success:true,
    });
});

async function updateStock (id,quantity){
    const product = await Product.findById(id);

    product.Stock -= quantity;

    await product.save({ validateBeforeSave:false});
}


//To Delete Order (Administrator)
exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{
    const order =await Order.findById(req.params.id);

    if(!order){
        return next(new ErrorHandler("Order not found with the requested ID",404));
    }

    await order.remove();
    

    res.status(200).json({
        success:true,
    });
});


