const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const vandors = db.vandor;
const { validationResult } = require("express-validator");
const helper = require("../common/helper");

require("dotenv").config();


/**
 * Add vendor
 */
addVandor = async (req, res) => {
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
    const { name, email, vendorType, operatingFrom, contactNumber } = req.body;

    // Generate OTP
    const verificationCode = helper.generateRandomNumber(6);

    // Create vendor in database with OTP details
    const newVendor = await Vendor.create({
      name,
      email,
      vendorType,
      operatingFrom,
      contactNumber,
      verificationCode,
    });

    // Send OTP via email
    const emailData = {
      email: email,
      subject: "Verify your email with Unique Code",
      html: `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification Unique Code</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              background-color: #f4f4f4;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            h2 {
              color: #007bff;
            }
            p {
              margin-bottom: 10px;
            }
            .verification-code {
              font-size: 24px;
              font-weight: bold;
              color: #28a745;
            }
            footer {
              margin-top: 20px;
              font-size: 12px;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Your Unique Code for Verification</h2>
            <p>Dear ${name},</p>
            <p>Your unique verification code is: <span class="verification-code">${verificationCode}</span></p>
            <p>Please use this unique code to verify your email address and set a new password.</p>
            <footer>
              <p>Thank you,</p>
            </footer>
          </div>
        </body>
        </html>`,
    };

    // Send email
    await helper.sendMail(emailData);

    res
      .status(201)
      .json({
        msg: "message: Vendor added successfully. Verification email sent.",
      });
  } catch (error) {
    console.error("Error adding vendor:", error);
    res.status(500).json({ error: "Failed to add vendor." });
  }
};

/**
 * Login vandor
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
    var isVandorExist = await vandors.findOne({
      where: { email: req.body.email },
    });

    if (isVandorExist) {
      const isMatch = await bcrypt.compare(
        req.body.password,
        isVandorExist.password
      );

      if (isMatch) {
        var token =
          "Bearer " +
          jwt.sign({ vandorId: isVandorExist.id }, process.env.secretKey, {
            expiresIn: "2d",
          });

        var responseObj = {
          id: isVandorExist.id,
          name: isVandorExist.name,
          email: isVandorExist.email,
          vendorType: isVandorExist.vendorType,
          operatingFrom: isVandorExist.operatingFrom,
          token: token,
        };

        return res
          .status(200)
          .json({ msg: "login successfully !!", data: responseObj });
      } else {
        return res.status(400).json({ msg: "wrong password!!" });
      }
    } else {
      return res.status(400).json({ msg: "vandor not found !!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("internal server error");
  }
};

/**
 * Verify vandor
 */
verifyCodeAndsetPassword = async (req, res) => {
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
        const bearerToken = req.headers["authorization"];

        var splitToken = bearerToken.split(" ");
    
        if (splitToken[0] != "Bearer") {
          return res.status(400).send("valid token is required");
        }


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
                  return res.status(400).send({msg:"vendor not found !!"});
                } else {
                    const {  verificationCode, newPassword } = req.body;
  
                    const vendor = await Vendor.findOne({ where: {id:vendorExist.id , verificationCode } });
                
                    if (!vendor) {
                      return res
                        .status(400)
                        .json({ msg: "Invalid verification code or email." });
                    }
                
                    const hashedPassword = await bcrypt.hash(newPassword, 10);
              
                    var  updateObj = {
                      verificationCode :verificationCode ,
                      password:hashedPassword,
                   }
                
                   updateData = await vandors.update(updateObj,{
                      where:{
                          id:vendorId
                      }
                   })
              
                    res
                      .status(200)
                      .json({ msg: "Verification  and new password set successful." });
                }
              }
            })



    } catch (error) {
      console.error("Error verifying code and updating password:", error);
      res
        .status(500)
        .json({ error: "Failed to verify code and update password." });
    }
  };

  /**
 * Update vandor profile
 */
 updateProfile = async (req, res) => {
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
      const vendorId = req.params.id;
      const { reportingPersonName, availabilityHours } = req.body;
      const documentPath = req.file ? req.file.path : null;
  
      const vendor = await vandors.findOne({
        where:{
            id:vendorId
      }});
  
      if (!vendor) {
        return res.status(404).json({ error: 'Vendor not found.' });
      }

     var  updateObj = {
        reportingPersonName :reportingPersonName ,
        availabilityHours:availabilityHours,
        document:documentPath,
        profileCompleted:true
     }
  
     updateData = await vandors.update(updateObj,{
        where:{
            id:vendorId
        }
     })
  
      res.status(200).json({ message: 'Profile updated successfully.' });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Failed to update profile.' });
    }
  };

// Get all KYC requests
 getKycRequests = async (req, res) => {
    try {
      const kycRequests = await vandors.findAll({
        where: { kycStatus: 'pending',profileCompleted:1 },
        attributes: ['id', 'name', 'email', 'vendorType', 'operatingFrom', 'contactNumber']
      });
  
      res.status(200).json({msg:'Get list of KYC request succesfully',data:kycRequests});
    } catch (error) {
      console.error('Error retrieving KYC requests:', error);
      res.status(500).json({ error: 'Failed to retrieve KYC requests.' });
    }
  };


module.exports = {
  addVandor,
  verifyCodeAndsetPassword,
  login,
  updateProfile,
  getKycRequests
};
