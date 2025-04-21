const jwt = require("jsonwebtoken")
const userModel = require("../models/user-model")
const bcrypt = require("bcrypt")
const moment = require("moment")
// signup
exports.signup = async (req, res) => {
    try {
        const { mobile, password } = req.body
        const checkExistingUser = await userModel.findOne({ mobile: mobile })
        if (checkExistingUser) {
            return res.staus(400).json({ msg: "user already exists" })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        let saveUser = new userModel({ mobile: mobile, password: hashedPassword })
        await saveUser.save()
        return res.status(200).json({ msg: "user siggned up successfully" })
    } catch (error) {
        console.log("error at controller signup", error);
        return res.status(500).json({ msg: "server error" })
    }
}
// login
exports.login = async (req, res) => {
    try {
        const { mobile, password } = req.body
        const mobileChecking = /^[6-9]\d{9}$/g
        if (!mobileChecking) {
            return res.status(400).json({ msg: "invalid mobile number" })
        }
        const matchDetails = await userModel.findOne({ mobile: mobile })
        if (!matchDetails) {
            return res.status(404).json({ msg: "invalid credentials" })
        }
        const matchPassword = await bcrypt.compare(password, matchDetails.password)
        if (!matchPassword) {
            return res.staus(404).json({ msg: "invalid credentials" })
        }
        let minimum = 100000
        let maximum = 999999
        const otp = Math.floor(Math.random() * (maximum - minimum + 1) + minimum)
        // const otp = Math.floor(Math.random()*(maximum - minimum + 1)+minimum)
        await userModel.updateOne({ mobile: mobile }, { $set: { otp: otp } })
        return res.status(200).json({ msg: `otp send successfully `, otp: otp })
    } catch (error) {
        console.log("controller error in login", error);
        return res.status(500).json({ msg: "server" })
    }
}
// otp verification
exports.verifyOtp = async (req, res) => {
    try {
        const { mobile, otp, created_at } = req.body
        if (otp.length != 6) {
            return res.status(400).json({ msg: "check otp it must be of six digit" })
        }
        const userDetails = await userModel.findOne({ mobile: mobile })
        if (!userDetails) {
            return res.status(400).json({ msg: "no user found" })
        }
        if (userDetails.otp == otp) {
            let currentTime = new Date(moment())
            let token = jwt.sign({ _id: userDetails._id, created_at: currentTime }, "suerSocket")
            await userModel.updateOne({ mobile: mobile }, { $set: { created_at: currentTime } })
            return res.status(200).json({ msg: "opt verified", token: token })
        }
    } catch (error) {
        console.log("error in otp verifiction", error);
        return res.status(500).json({ msg: "server error" })
    }
}