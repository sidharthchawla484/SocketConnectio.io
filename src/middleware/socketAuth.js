const jwt = require("jsonwebtoken")
const user = require("../models/user-model")


const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake.query?.token;
        if (!token) {
            next(new Error("no token provided...."))
        }
        const tokenDecode = jwt.verify(token, "suerSocket")
        console.log("decoded token ", tokenDecode);
        const tokenDate = new Date(tokenDecode.created_at)
        console.log("decoded date", tokenDate);
        console.log("token decode", tokenDecode);
        const findUser = await user.findOne({ _id: tokenDecode._id })
        if (!findUser) {
            return next(new Error("user not found"))
        }
        console.log("user's date==", findUser.created_at);

        const dateOfUserCreation = new Date(findUser.created_at)
        if (tokenDate.getTime() !== dateOfUserCreation.getTime()) {
            return next(new Error(" user session expired...."))
        }
        socket.id = findUser._id
        socket.user = findUser
        console.log("socketUSErToken", tokenDecode._id);
        next()
    } catch (error) {
        console.log("error in socket auth", error);
        return next(new Error("server Error", error))
    }
}
module.exports = socketAuth