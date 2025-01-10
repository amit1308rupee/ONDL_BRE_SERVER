const BREConfig = require('../models/breModel');

exports.createBREConfig = async (req, res) => {
    try {
        const breConfig = await BREConfig.create(req.body);
        res.status(201).json({ status: 'success', data: { breConfig } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getBREConfigs = async (req, res) => {
    try {
        const breConfigs = await BREConfig.find();
        res.status(200).json({ status: 'success', data: { breConfigs } });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
