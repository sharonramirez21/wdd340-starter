const { parse } = require("dotenv")
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
    let classificationList = await utilities.buildClassificationList()
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationList,
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


// return inventory by classification as JSON
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data retured."))
  }
}

// for edit in view 
invCont.editInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    let classificationList = await utilities.buildClassificationList()
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("inventory/edit-inventory", {
      title: "Edit -" + itemName,
      nav,
      classificationList: classificationList,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })

  } catch (error) {
    next(error)
  }
}


invCont.updateInventory = async (req, res) => {
  let nav = await utilities.getNav()
  const {
    inv_id,
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

  const updateResult = await invModel.updateInventory(
    inv_id,
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

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
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
    })
  }
}

/**
 * DELETE PROCESS
 * delete confirmation view is being built and delivered
 */
invCont.deleteInventoryView = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id)
    let nav = await utilities.getNav()
    const itemData = await invModel.getInventoryById(inv_id)
    let classificationList = await utilities.buildClassificationList()
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`
    res.render("inventory/delete-confirm", {
      title: "Delete -" + itemName,
      nav,
      classificationList: classificationList,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
      classification_id: itemData.classification_id
    })

  } catch (error) {
    next(error)
  }
}

invCont.deleteVehicle = async (req, res) => {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.body.inv_id)
  
  const deleteResult = await invModel.deleteVehicle(inv_id)

  if (deleteResult) {
    req.flash("success", "The vehicle was successfully deleted.")
    return res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    return res.redirect(`/inv/delete/${inv_id}`)
  }
}

module.exports = invCont