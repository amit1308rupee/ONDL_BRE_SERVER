const express = require('express');
const breController = require('../controllers/breController');

const router = express.Router();

router.post('/bre', breController.createBREConfig);
router.get('/bre', breController.getBREConfigs);

module.exports = router;
