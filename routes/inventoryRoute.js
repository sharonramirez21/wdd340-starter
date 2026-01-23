// need resources
const express = require("express");
const router = new express.Router()
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

router.get("/detail/:invId", invController.buildDetail);

// Intentional error route
router.get("/trigger-error", invController.triggerError)

module.exports =  router;