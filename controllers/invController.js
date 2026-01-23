const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/********  
 * Build inventory by classification view
 *************/

invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/**
 * build inventory item detail view
 */
invCont.buildDetail = async function (req, res,  next) {
    const invId = req.params.invId;

    try {
        const vehicleData = await invModel.getInventoryById(invId);
        const vehicleDetail = await utilities.buildVehicleDetailHTML(vehicleData);
        let nav = await utilities.getNav();

        res.render("./inventory/detail", {
            title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
            nav,
            vehicleDetail,
        });
    } catch (error) {
        next(error);
    }
}

/***Intentional 500 error***/
invCont.triggerError = async function (req, res, next) {
  throw new Error("Intentional server error for testing")
}

module.exports = invCont