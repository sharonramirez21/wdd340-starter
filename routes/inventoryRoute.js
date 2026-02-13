// need resources
const express = require("express");
const router = new express.Router()
const invController = require("../controllers/invController")
const addValidate = require("../utilities/add-validation");
const Util = require("../utilities");
const invValidate = require("../utilities/inv-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:invId", invController.buildDetail);

// Intentional error route
router.get("/trigger-error", invController.triggerError)

// dealing with inventory 
router.get("/", Util.checkLogin, Util.checkAdminEmployee, invController.buildManagement)

// add-classification
router.get("/add-classification", Util.checkLogin, Util.checkAdminEmployee, invController.buildAddClassification)
router.post("/add-classification", Util.checkLogin, Util.checkAdminEmployee, addValidate.classificationRules(), addValidate.checkClassificationData, invController.addClassification)

// add-inventory 
router.get("/add-inventory", Util.checkLogin ,Util.checkAdminEmployee, invController.buildAddInventory)
router.post("/add-inventory", Util.checkLogin, Util.checkAdminEmployee, addValidate.inventoryRules(), addValidate.checkInventoryData , invController.addInventory)

// Inventory Route with json
router.get("/getInventory/:classification_id", Util.handleErrors(invController.getInventoryJSON))

// for edit link 
router.get("/edit/:inv_id", Util.checkLogin, Util.checkAdminEmployee, Util.handleErrors(invController.editInventoryView))

// update inventory or vehicle
router.post("/update", Util.checkLogin, Util.checkAdminEmployee, addValidate.inventoryRules(), addValidate.checkUpdateData, Util.handleErrors(invController.updateInventory))

// delete vehicle 
router.get("/delete/:inv_id", Util.checkLogin, Util.checkAdminEmployee, Util.handleErrors(invController.deleteInventoryView))
router.post("/delete", Util.checkLogin, Util.checkAdminEmployee, Util.handleErrors(invController.deleteVehicle))

// vehcile search 
router.get("/search", Util.handleErrors(invController.searchVehicle))
router.post("/search", invValidate.searchRules(), invValidate.checkSearchData, Util.handleErrors(invController.searchVehicle))

module.exports =  router;