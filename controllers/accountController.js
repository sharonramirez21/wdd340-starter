const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

/**
 * deliver login view
 */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    // req.flash("notice", "Login in your account")
    res.render("account/login", {
        title: "Login",
        nav,
    })
}

/**
 * build register 
 */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    // req.flash("notice", "Register your account")
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
    })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}


/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

// process the request and deliver the view.
async function buildAccountManagement(req, res) {
  let nav = await utilities.getNav()
  res.render("account/account", {
    title: "Account Management",
    nav,
    errors: null,
    accountData: res.locals.accountData
  })
}

// account-info update 
async function updateInfoAccount(req, res) {
  let nav = await utilities.getNav()
  res.render("account/update", {
    title: "Update Account",
    nav,
    errors: null,
    account_id: res.locals.accountData.account_id,
    account_firstname: res.locals.accountData.account_firstname,
    account_lastname: res.locals.accountData.account_lastname,
    account_email: res.locals.accountData.account_email
  })
}

async function updateAccountInfo(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  
  const updateResult = await accountModel.updateAccountInfo(
    account_id,
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateResult) {
    const updatedAccount = await accountModel.getAccountById(account_id)
    req.flash("notice", "Account information updated successfully.")
    return res.render("account/account", {
      title: "Account Management",
      nav,
      errors: null,
      accountData: updatedAccount
    })
  } else {
    req.flash("notice", "Update failed. Please try again.")
    return res.render("account/update", {
      title: "Update Account",
      nav,
      account_id,
      account_firstname,
      account_lastname,
      account_email
    })
  }
}
// update password
async function updatePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_id, account_password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(account_password, 10)
    const result = await accountModel.updateAccountPassword(
      account_id,
      hashedPassword
    )

    if (result) {
      const updatedAccount = await accountModel.getAccountById(account_id)

      req.flash("notice", "Password updated successfully.")

      return res.render("account/account", {
        title: "Account Management",
        nav,
        errors: null,
        accountData: updatedAccount
      })
    } else {
      req.flash("notice", "Password update failed.")
      return res.redirect("/account/update")
    }

  } catch (error) {
    req.flash("notice", "Password error.")
    return res.redirect("/account/update")
  }
}

// LOGOUT PROCESS
async function accountLogout(req, res) {
  res.clearCookie("jwt")
  req.flash("notice", "You have been logged out")
  return res.redirect("/")
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin , buildAccountManagement, updateInfoAccount, updateAccountInfo, updatePassword , accountLogout}