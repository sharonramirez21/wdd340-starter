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

/*** Intentional 500 error ***/
invCont.triggerError = async function (req, res, next) {
  const err = new Error("Intentional server error for testing")
  err.status = 500
  next(err)
}

// dealing with inventory.
invCont.buildManagement = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav
    })
  } catch (error) {
    next(error)
  }
}

invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null
    })
  } catch (error) {
    next(error)
  }
}

// add classification 
invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)

    if (result) {
      req.flash(
        "notice",
        `Congratulations, you're added ${classification_name}.`
      )
      return res.redirect("/inv/add-classification")
    } else {
      throw new Error("Insert failed")
    }
  } catch (error) {
    req.flash("notice", "Error! The classification could not be saved.")
    return res.redirect("/inv/add-classification")
  }
}

// add inventory
invCont.buildAddInventory = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    let classificationList = await utilities.buildClassificationList()

    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: null,
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "/images/vehicles/no-image.png",
      inv_thumbnail: "/images/vehicles/no-image-tn.png",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
    })

  } catch (error) {
    next(error)
  }
}

invCont.addInventory = async (req, res) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body

  const addResult = await invModel.addInventory(
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  )

  if (addResult) {
    req.flash("notice", "Vehicle added successfully.")
    return res.redirect("/inv/add-inventory")
  } else {
    req.flash("notice", "Sorry, the vehicle could not be added.")
    return res.redirect("/inv/add-inventory")
  }
}


module.exports = invCont