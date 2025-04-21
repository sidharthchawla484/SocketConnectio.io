const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const userModel = require("../models/user-model")

const Group = require("../models/group-model")  
// creating group
exports.createGroup = async (req, res) => {
    try {
        const { mobile } = req.body;  
        const user = await userModel.findOne({ mobile });
        if (!user) {
            return res.status(400).json({ msg: "User not found" }); 
        }
        let minimum = 100000;
        let maximum = 999999;
        const groupId = Math.floor(Math.random() * (maximum - minimum + 1) + minimum);

        const newGroup = new Group({
            groupId: groupId,             
            created_by: user._id,         
            members: [user._id]           
        });
        await newGroup.save();
        user.groupId = groupId;
        await user.save();
        return res.status(200).json({
            msg: "Group created successfully",
            groupId: groupId
        });

    } catch (error) {
        console.log("Error in creating group:", error);
        return res.status(500).json({ msg: "Server error" });
    }
};


