import React from "react";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import "./orderSuccess.css";
import { Typography } from "@material-ui/core";
import { Link } from "react-router-dom"; 




const OrderSuccess = () => {
    return (
        <div className="orderSuccess">
            <CheckCircleIcon />

            <Typography> Your Have Succcessfully Placed Your Order </Typography>
            <Link to="/orders"> View Your Orders </Link>
            
        </div>
    );
};

export default OrderSuccess;
