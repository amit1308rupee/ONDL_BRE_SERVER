const express = require('express');
const router = express.Router();
const {createLender,upload} = require('../controllers/lenderController');


router.post('/bre/lenders-policy', upload.single('pin_range'), createLender);

module.exports = router;