import mongoose, { Schema } from "mongoose"

const adminSchema = new mongoose.Schema({
    googleId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    }
    ,
    email: {
        type: String, 
        required: true,
        unique: true
    },
    photo: {
        type: String
    }
})

const Admin = mongoose.model("Admin", adminSchema)
export default Admin