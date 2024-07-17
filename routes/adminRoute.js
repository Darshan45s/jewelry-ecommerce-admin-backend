const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const validateModel = require("../middlware/validator");
const verifyToken = require("../middlware/auth");



/**
 * REGISTER
 */
router.post("/", validateModel.registerValidation,adminController.Register);


/**
 * LOGIN
 */
router.post("/login", validateModel.loginValidation, adminController.login);

/**
 * LOGOUT
 */
router.post(
  "/logout/:id",
  verifyToken.verifyTokenAdmin,adminController.logOut
);

module.exports = router;
