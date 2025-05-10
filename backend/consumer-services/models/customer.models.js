import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
    name:{
        type: String, 
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    phone:{
        type: String,
        required: true,
        unique: true
    },
    address:{
        type: String,
        required: true,
        trim: true
    },
    lastActiveAt: {
        type: Date,
        default: Date.now
    }
},{timestamps: true})

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;