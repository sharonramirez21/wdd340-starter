// resources
const express = require("express");
const router = new express.Router()
const Util = require("../utilities/index")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

router.get("/login", Util.handleErrors(accountController.buildLogin))
router.get("/register", Util.handleErrors(accountController.buildRegister))

// Process registration
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, Util.handleErrors(accountController.registerAccount))
// Process the login attempt
router.post("/login",(req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;