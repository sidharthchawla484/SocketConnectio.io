const express = require("express")
const controllers= require("../controllers/userController")
const router = express.Router()
// const userAuth = require("../middleware/userAuth")
const socketController = require("../controllers/socketController")
const userAuth = require("../middleware/userAuth")



router.post("/user/signup",controllers.signup)
router.get("/user/login" , controllers.login)
router.post("/user/verifyOtp", controllers.verifyOtp)
router.post("/user/createGroup",userAuth ,socketController.createGroup)
module.exports = router