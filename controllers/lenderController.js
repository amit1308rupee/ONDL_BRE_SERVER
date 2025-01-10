const Lender = require('../models/lenderModel');
const csv = require('csv-parser');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const createLender = (req, res) => {
    const { lender_name, min_age, max_age, min_salary, cibil_required } = req.body;
    const pin_range = [];

    // Validate required fields
    const missingFields = [];
    if (!lender_name) missingFields.push('lender_name');
    if (!min_age) missingFields.push('min_age');
    if (!max_age) missingFields.push('max_age');
    if (!min_salary) missingFields.push('min_salary');
    if (!req.file) missingFields.push('pin_range');
    if (!cibil_required) missingFields.push('cibil_required');

    if (missingFields.length > 0) {
        return res.status(400).send({
            status: 'failure',
            message: 'Validation failed.',
            data: null,
            errors: [{ message: 'Missing required fields', missingFields }]
        });
    }

    // Check if lender_name already exists
    Lender.findByName(lender_name, (err, existingLender) => {
        if (err) {
            console.error('Error checking lender name:', err);
            return res.status(500).send({
                status: 'failure',
                message: 'Internal server error',
                data: null,
                errors: [{ message: err.message }]
            });
        }

        if (existingLender) {
            return res.status(400).send({
                status: 'failure',
                message: 'Lender already exists',
                data: null,
                errors: [{ message: 'Lender with this name already exists' }]
            });
        }

        // Process CSV file and create lender
        fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (row) => {
                pin_range.push(row.area_pincode);
            })
            .on('end', () => {
                const lenderData = {
                    lender_name,
                    min_age,
                    max_age,
                    min_salary,
                    pin_range: JSON.stringify(pin_range),
                    cibil_required
                };

                Lender.create(lenderData, (err, result) => {
                    if (err) {
                        console.error('Error from Lender Policy:', err);
                        res.status(500).send({
                            status: 'failure',
                            message: 'Internal server error',
                            data: null,
                            errors: [{ message: err.message }]
                        });
                    } else {
                        res.status(201).send({
                            status: 'success',
                            message: 'Lender created successfully',
                            data: null,
                            errors: null
                        });
                    }
                });
            });
    });
};

module.exports = { upload, createLender }