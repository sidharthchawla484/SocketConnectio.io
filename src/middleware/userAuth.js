const jwt = require("jsonwebtoken")
const user = require("../models/user-model")

const userAuth = async(req , res , next)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(500).json({msg:"no token provided"})
        }
        const tokenDecode = jwt.verify(token , "suerSocket")
        const tokenDate = new Date(tokenDecode.created_at)

        const User = await user.findOne({_id : tokenDecode._id})
        if(!User){
            return res.status(500).json({msg:"no user found"})
        }
        let userDate = new Date(User.created_at)
        console.log("tokenDate.getTime()", typeof tokenDate);
        console.log("user.created_at.getTinme", typeof User.created_at);        
        if( tokenDate.getTime() !== User.created_at.getTime() ){
            return res.status(400).json({msg:"session expired"})
        }
        req._id = User._id
        req.user = User
        next()
    } catch (error) {
        console.log("error of user auth",  error);
        return res.status(500).json({msg:"server error"})
    }
}
module.exports = userAuth