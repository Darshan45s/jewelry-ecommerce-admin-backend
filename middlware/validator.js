const { check } = require("express-validator");

/**
 * REGISTER
 */
exports.registerValidation = [
  check("name", "name is requied ").not().isEmpty().isString().withMessage('name should be string'),
  check("email", "email is a required")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check("password", "Password is required ")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  check("confirmPassword", "confirm-Password is requied").not().isEmpty(),
];

/**
 * LOGIN
 */
exports.loginValidation = [
  check("email", "Please include a valid email")
    .isEmail()
    .normalizeEmail({ gmail_remove_dots: true }),
  check(
    "password",
    "Please include a valid Password"
  ),
];

/**
 * add vandor
 */
exports.addVandorValidation = [
    check("name", "name is requied ").not().isEmpty().isString().withMessage('name should be string'),
    check("email", "email is a required")
      .isEmail()
      .normalizeEmail({ gmail_remove_dots: true }),
  ];

/**
 * complete Profile
 */
  exports.completeProfile = [
    check("reportingPersonName",'reportingPersonName is required').not().isEmpty().isString().withMessage('reportingPersonName should be string'),
    check('availabilityHours','availabilityHours is required').not().isEmpty(),
    check('document','document is required')
  ]

  /**
 * complete Profile
 */
  exports.verifyAndsetPassword = [
    check('code','code is required').not().isEmpty(),
    check('password','password is required').not().isEmpty()
  ]
