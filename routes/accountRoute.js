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

// account-info form
router.get("/update", Util.checkLogin, Util.handleErrors(accountController.updateInfoAccount))
router.post("/update", Util.checkLogin, regValidate.updateAccountRules(), regValidate.checkUpdateData, Util.handleErrors(accountController.updateAccountInfo))

// account-password form
router.post("/update-password", Util.checkLogin, regValidate.updatePasswordRules(), regValidate.checkPasswordData, Util.handleErrors(accountController.updatePassword))

// logout router
router.get("/logout", Util.handleErrors(accountController.accountLogout))
module.exports = router;