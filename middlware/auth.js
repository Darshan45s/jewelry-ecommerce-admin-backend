const jwt = require("jsonwebtoken");
const db = require("../config/db");
const admins = db.admin;

/**
 * VERIFY ADMINAUTHENTICATION TOKEN FUNCTION
 */
 verifyTokenAdmin = async (req, res, next) => {
    const bearerToken = req.headers["authorization"];

    var splitToken = bearerToken.split(" ");

    if (splitToken[0] != "Bearer") {
      return res.status(400).send("Unauthorized");
    }
    try {
      jwt.verify(
        splitToken[1],
        process.env.secretKey,

        async function (err, decoded) {
          if (err) {
            return res.status(400).send("Unauthorized");
          } else {
            var adminExist = await admins.findOne({
              where: { id: decoded.adminId },
            });


            const vendorExist = await vendors.findOne({
                where: { id: decoded.vendorId },
              });

            if (adminExist == null) {
              return res.status(400).send("Unauthorized");
            } else {
              return next();
            }
          }
        }
      );
    } catch (err) {
      return res.status(400).send("Unauthorized");
    }
  };

/**
 * VERIFY VANDORAUTHENTICATION TOKEN FUNCTION
 */
  verifyTokenVandor = async (req, res, next) => {
    const bearerToken = req.headers["authorization"];

    var splitToken = bearerToken.split(" ");

    if (splitToken[0] != "Bearer") {
      return res.status(400).send("Unauthorized");
    }
    try {
      jwt.verify(
        splitToken[1],
        process.env.secretKey,

        async function (err, decoded) {
          if (err) {
            return res.status(400).send("Unauthorized");
          } else {
    
            const vendorExist = await vendors.findOne({
                where: { id: decoded.vendorId },
              });

            if (vendorExist == null) {
              return res.status(400).send("Unauthorized");
            } else {
              return next();
            }
          }
        }
      );
    } catch (err) {
      return res.status(400).send("Unauthorized");
    }
  };

module.exports = {
    verifyTokenAdmin,
    verifyTokenVandor
};
