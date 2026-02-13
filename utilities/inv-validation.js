const { body, validationResult } = require("express-validator")
const utilities = require("./index")
const invModel = require("../models/inventory-model")

const validate = {}

/**
 * search validatios rules
 */
validate.searchRules = () => {
    return [
        body("term")
            .trim()
            .isLength({ min:2 })
            .withMessage("Please enter at least 2 charachters to search.")
            .escape()
    ]
}

/**
 * check search data
 */
validate.checkSearchData = (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
        req.flash("notice", errors.array()[0].msg)
        return res.redirect("/")
    }
    next()
}


module.exports = validate