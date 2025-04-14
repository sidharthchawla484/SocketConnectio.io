
const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({

    mobile:{
        type: Number,
        unique: true,
        required: true 
    },
    password:{
        type: String, 
        required: true
    },
    otp:{
        type: String,
        required: false
    },
    created_at: {
        type: Date,
        default: Date.now, // automatically sets the current date/time when a document is created
    },
    groupId:{
        type: String, 
        required: false
    }
})
const User = mongoose.model("userSocket", userSchema)
module.exports = User