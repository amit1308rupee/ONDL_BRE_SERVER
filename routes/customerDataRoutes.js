const express = require('express');
const { upload, uploadFile , getData } = require('../controllers/customerDataController');
const router = express.Router();
// const consumerController = require('../controllers/customerDataController');

router.post('/partners/customers', upload.single('file'), uploadFile);
router.get('/partners/customer-data', getData);

module.exports = router;
