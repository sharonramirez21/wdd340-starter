// resources
const express = require("express");
const router = new express.Router()
const Util = require("../utilities/index")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

router.get("/login", Util.handleErrors(accountController.buildLogin))
router.get("/register", Util.handleErrors(accountController.buildRegister))

// Process registration
router.post('/register', regValidate.registrationRules(), regValidate.checkRegData, Util.handleErrors(accountController.registerAccount))
// Process the login request
router.post("/login", regValidate.loginRules(), regValidate.checkLoginData, Util.handleErrors(accountController.accountLogin))

// Account Management View
router.get("/", Util.checkLogin, Util.handleErrors(accountController.buildAccountManagement))


module.exports = router;