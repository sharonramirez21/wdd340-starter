/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require('./database/')

const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()

const app = express()
const static = require("./routes/static")

const baseController = require("./controllers/baseController")

const inventoryRoute = require("./routes/inventoryRoute")

const utilities = require("./utilities")

const accountRoute = require("./routes/accountRoute")

const bodyParser = require("body-parser")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")


/**
 * Middleware 
 */
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true})) // for parsing application/x-www-form-urlencoded

/**
 * Express message middleware
 */
app.use(require('connect-flash')())
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

/* ***********************
 * Routes
 *************************/
app.use(static)

// index route  -- index html
app.get("/", baseController.buildHome)

//inventory routes
app.use("/inv", inventoryRoute)

// account router
app.use("/account", accountRoute)



// File Not Found Route - must be last route in list
// 404 
app.use(async (req, res) => {
  let nav = await utilities.getNav()
  res.status(404).render("errors/error", {
    title: "Page Not Found",
    message: "Sorry, we appear to have lost that page.",
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
// 500 error
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  res.status(500).render("errors/error-500", {
    title: "Server Error",
    message: "Oh no! There was a crash. Maybe try a different route?",
    nav
  })
})

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
