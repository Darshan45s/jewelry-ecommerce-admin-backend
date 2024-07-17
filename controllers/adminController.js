const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const admins = db.admin;
const { validationResult } = require("express-validator");

require("dotenv").config();

/**
 * Register Admin
 */

Register = async (req, res) => {
  /**
   * REQUIRE FIELD CONDITION
   */
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(400)
      .json({ msg: "provide required fields", errors: error.array() });
  }
  try {
    var isAdminExist = await admins.findOne({ where: { email: req.body.email } });
    if (!isAdminExist) {
      /**
       *PASSWORD VALIDATION
       */
      if (req.body.password == req.body.confirmPassword) {
        const salt = await bcrypt.genSalt(10);

        const hash_password = await bcrypt.hash(req.body.password, salt);

        var adminObj = {
          name: req.body.name,
          email: req.body.email,
          password: hash_password,
          isLogin: 0,
        };

        var data = await admins.create(adminObj);

        const adminData = await admins.findOne({ where: { id: data.id } });

        var token =
          "Bearer " +
          jwt.sign({ adminId: data.id }, process.env.secretKey, {
            expiresIn: "2d",
          });

        var responseObj = {
          id: adminData.id,
          firstName: adminData.name,
          email: adminData.email,
          isLogin: adminData.isLogin,
          token: token,
        };

        return res
          .status(201)
          .json({ msg: "admin added successfully", data: responseObj });
      } else {
        return res
          .status(400)
          .json({ msg: "password & confirmPassword should be same" });
      }
    } else {
      return res.status(400).json({ msg: "admin already exist!!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Internal server error");
  }
};


/**
 * Login Admin
 */
login = async (req, res) => {
  /**
   * REQUIRE FIELD CONDITION
   */
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(400)
      .json({ msg: "provide required fields", errors: error.array() });
  }
  try {
    var isAdminExist = await admins.findOne({ where: { email: req.body.email } });

    if (isAdminExist) {
      const isMatch = await bcrypt.compare(
        req.body.password,
        isAdminExist.password
      );

      if (isMatch) {
        var token =
          "Bearer " +
          jwt.sign({ adminId: isAdminExist.id }, process.env.secretKey, {
            expiresIn: "2d",
          });

        var updateObj = {
          isLogin: 1,
        };

        await admins.update(updateObj, {
          where: {
            id: isAdminExist.id,
          },
        });
        var adminData = await admins.findOne({
          where: { id: isAdminExist.id },
        });
        var responseObj = {
          id: adminData.id,
          name: adminData.name,
          email: adminData.email,
          role: adminData.role,
          isLogin: adminData.isLogin,
          token: token,
        };

        return res
          .status(200)
          .json({ msg: "login successfully !!", data: responseObj });
      } else {
        return res
          .status(400)
          .json({ msg: "wrong password!!" });
      
      }
    } else {
        return res
          .status(400)
          .json({ msg: "admin not found !!" });
    
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};


/**
 * Logout Admin
 */
logOut = async (req, res) => {
      /**
   * REQUIRE FIELD CONDITION
   */
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res
      .status(400)
      .json({ msg: "Provide required fields", errors: error.array() });
  }
  try {
    var isAdminExist = await admins.findOne({ where: { id: req.params.id } });

    if (isAdminExist) {
      var updateObj = {
        isLogin: 0,
      };

      await admins.update(updateObj, {
        where: {
          id: req.params.id,
        },
      });
      var adminData = await admins.findOne({
        where: { id: req.params.id },
      });
      var responseObj = {
        id: adminData.id,
        name: adminData.name,
        email: adminData.email,
        role: adminData.role,
        isLogin: adminData.isLogin,
      };
      return res
      .status(200)
      .json({ msg: "logout successfully !!", data: responseObj });
    } else {
        return res
        .status(400)
        .json({ msg: "admin not found !!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};

module.exports = {
  Register,
  login,
  logOut,
};
