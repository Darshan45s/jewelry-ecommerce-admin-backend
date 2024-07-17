const express = require('express');
const vendorCtrl = require('../controllers/vandorController');
const upload = require('../middlware/upload');
const validateModel = require("../middlware/validator");

const router = express.Router();

router.post('/vendors', vendorCtrl.addVandor);
router.post('/vendors/login',validateModel.loginValidation ,vendorCtrl.login);
router.post('/vendors/verify',vendorCtrl.verifyCodeAndsetPassword)
router.put('/vendors/:id/profile', upload.single('document'), vendorCtrl.updateProfile);
router.get('/vendor/kyc', verifyTokenAdmin, vendorCtrl.getKycRequests);

module.exports = router;