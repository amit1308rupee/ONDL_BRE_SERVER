const express = require('express');
const router = express.Router();
const { checkEligibility } = require('../controllers/basicEligibilityController');

router.post('/bre/basic-eligibility', checkEligibility);

module.exports = router; 