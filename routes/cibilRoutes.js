const express = require('express');
const { upload, processFile } = require('../controllers/cibilController');

const router = express.Router();

router.post('/bre/cibil/upload', upload.single('file'), processFile);

module.exports = router;