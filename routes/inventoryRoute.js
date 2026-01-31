// need resources
const express = require("express");
const router = new express.Router()
const invController = require("../controllers/invController")
const addValidate = require("../utilities/add-validation");
const validate = require("../utilities/add-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:invId", invController.buildDetail);

// Intentional error route
router.get("/trigger-error", invController.triggerError)

// dealing with inventory 
router.get("/", invController.buildManagement)

// add-classification
router.get("/add-classification", invController.buildAddClassification)
router.post("/add-classification", addValidate.classificationRules(), addValidate.checkClassificationData, invController.addClassification)

// add-inventory 
router.get("/add-inventory", invController.buildAddInventory)
router.post("/add-inventory", validate.inventoryRules(), validate.checkInventoryData , invController.addInventory)

module.exports =  router;