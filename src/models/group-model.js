const mongoose = require("mongoose")
const user = require("./user-model")
const groupSchema = new mongoose.Schema({
    groupId: {
        type: String,
        unique: true
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true })

const Group = mongoose.model("Group", groupSchema)

module.exports = Group