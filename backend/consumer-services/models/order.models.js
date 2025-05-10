import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },
    product:{
        type: String,
        required: true,
    },
    quantity:{
        type: Number,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    status:{
        type: String,
        enum: ['pending', 'shipped', 'delivered'],
        default: 'pending'
    }
},{timestamps:true})

const Order = mongoose.model("Order", orderSchema);
export default Order;