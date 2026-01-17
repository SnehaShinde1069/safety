const { body, validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const validateRegister = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('fullName').notEmpty().withMessage('Full name is required'),
  body('phone').isMobilePhone().optional({ checkFalsy: true }),
  validateRequest
];

const validateLogin = [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
];

const validateContact = [
  body('name').notEmpty().withMessage('Contact name is required'),
  body('phone').isMobilePhone().withMessage('Valid phone number required'),
  body('email').isEmail().normalizeEmail().optional({ checkFalsy: true }),
  validateRequest
];

const validateIncident = [
  body('type').notEmpty().withMessage('Incident type is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('location').notEmpty().withMessage('Location is required'),
  validateRequest
];

module.exports = {
  validateRegister,
  validateLogin,
  validateContact,
  validateIncident,
  validateRequest
};
