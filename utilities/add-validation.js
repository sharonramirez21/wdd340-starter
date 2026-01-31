const utilities = require("./index")
const { body, validationResult } = require("express-validator")
const validate = {}

/**
 * validation rules
 */

validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .notEmpty()
            .withMessage("The classification name is required.")
            .isAlphanumeric()
            .withMessage("Spaces and special characters are not allowed.")
    ]
}

validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors,
            classification_name,
        })
        return
    }
    next()
}


validate.inventoryRules = () => {
    return [
        body("classification_id")
            .notEmpty()
            .withMessage("Please choose a classification..."),
        
        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("Make is required"),
        
        body("inv_model")
            .trim()
            .notEmpty()
            .withMessage("Model is required"),
        
        body("inv_year")
            .isInt({ min: 1900, max: 2099 })
            .withMessage("Please provide a valid year."),
        
        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Description is required"),
        
        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Image is required"),
        
        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Thumbnail path is required"),
        
        body("inv_price")
            .isFloat({ min: 0 })
            .withMessage("Price must be a positive number"),
        
        body("inv_miles")
            .isInt( { min : 0})
            .withMessage("Miles must be a positive number"),
        
        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Color is required"),
    ]
}

validate.checkInventoryData = async (req, res, next ) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classificationList = await utilities.buildClassificationList(
            req.body.classification_id
        )

        res.render("inventory/add-inventory", {
            title: "Add Inventory",
            nav,
            errors,
            classificationList,
            ...req.body,
        })
        return
    }
    next()
}


module.exports = validate