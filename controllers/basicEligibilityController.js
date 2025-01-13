const Lender = require('../models/lenderModel');
const CibilInput = require('../models/cibilInputModel');
const BasicEligibleLender = require('../models/basicEligibleLenderModel');

const checkEligibility = (req, res) => {
    const { pancard, name, mobile, salary, age, pincode, lead_id,current_address } = req.body;

    // console.log('Request received:', req.body);

    // Validate required fields
    const missingFields = [];
    if (!pancard) missingFields.push('pancard');
    if (!name) missingFields.push('name');
    if (!mobile) missingFields.push('mobile');
    if (!salary) missingFields.push('salary');
    if (!age) missingFields.push('age');
    if (!pincode) missingFields.push('pincode');
    if (!current_address) missingFields.push('Current Address');
    if (!lead_id) missingFields.push('lead_id');
    if (missingFields.length > 0) {
        // console.log('Validation failed. Missing fields:', missingFields);
        return res.status(400).send({
            status: 'failure',
            message: 'Validation failed.',
            data: null,
            errors: [{ message: 'Missing required fields', missingFields }]
        });
    }

    // Check eligibility
    Lender.findAll((err, lenders) => { 
        if (err) {
            // console.error('Error fetching lenders:', err);
            return res.status(500).send({
                status: 'failure',
                message: 'Internal server error',
                data: null,
                errors: [{ message: err.message }]
            });
        }

        // console.log('Lenders fetched:', lenders);

        const eligibleLenders = lenders.filter(lender => {
            let pinRange;
            try {
                pinRange = lender.pin_range;
                if (!Array.isArray(pinRange)) {
                    throw new Error('pin_range is not an array');
                }
            } catch (e) {
                console.error('Error parsing pin_range:', e);
                return false;
            }
            return salary >= lender.min_salary &&
                age >= lender.min_age &&
                age <= lender.max_age &&
                pinRange.includes(pincode);
        });

        // console.log('Eligible lenders:', eligibleLenders);

        const ineligibleReasons = lenders.map(lender => {
            let pinRange;
            const reasons = [];
            try {
                pinRange = lender.pin_range;
                if (!Array.isArray(pinRange)) {
                    throw new Error('pin_range is not an array');
                }
            } catch (e) {
                reasons.push('Invalid pin_range format');
            }

            if (salary < lender.min_salary) {
                reasons.push('Salary below minimum requirement');
            }
            if (age < lender.min_age || age > lender.max_age) {
                reasons.push('Age not within required range');
            }
            if (!pinRange.includes(pincode)) {
                reasons.push('Pincode not covered');
            }

            if (reasons.length > 0) {
                return { lender_name: lender.lender_name, reasons };
            }
            return null;
        }).filter(reason => reason !== null);

        // console.log('Ineligible reasons:', ineligibleReasons);

        const lenderNames = eligibleLenders.map(lender => lender.lender_name);
        const basicEligibility = lenderNames.length > 0;

        const Errors = [];

        // Check if lead_id already exists in CibilInput
        CibilInput.findByLeadId(lead_id, (err, existingCibilLead) => {
            if (err) {
                console.error('Error checking CIBIL lead_id:', err);
                return res.status(500).send({
                    status: 'failure',
                    message: 'Internal server error',
                    data: null,
                    errors: [{ message: err.message }]
                });
            }

            if (existingCibilLead) {
                Errors.push({
                    status: 'failure',
                    message: 'Lead_id already exists in CIBIL input',
                    data: null,
                    errors: [{ message: 'Lead_id with this id already exists in CIBIL input' }]
                });
            }

            // Check if lead_id already exists in BasicEligibleLender
            BasicEligibleLender.findByLeadId(lead_id, (err, existingLead) => {
                if (err) {
                    console.error('Error checking lead_id:', err);
                    return res.status(500).send({
                        status: 'failure',
                        message: 'Internal server error',
                        data: null,
                        errors: [{ message: err.message }]
                    });
                }

                if (existingLead) {
                    Errors.push({
                        status: 'failure',
                        message: 'Lead_id already exists in BasicEligibleLender',
                        data: null,
                        errors: [{ message: 'Lead_id with this id already exists in BasicEligibleLender' }]
                    });
                }

                if (Errors.length > 0) {
                    // console.log('Validation errors:', Errors);
                    return res.status(400).send({
                        status: 'failure',
                        message: 'Validation errors',
                        data: null,
                        errors: Errors
                    });
                }

                // Save data if any lender requires CIBIL and there are eligible lenders
                const requiresCibil = eligibleLenders.some(lender => lender.cibil_required);
                if (basicEligibility && requiresCibil) {
                    const cibilData = { name, pancard, mobile, lead_id , current_address};
                    CibilInput.create(cibilData, (err) => {
                        if (err) {
                            console.error('Error saving CIBIL input:', err);
                            return res.status(500).send({
                                status: 'failure',
                                message: 'Internal server error',
                                data: null,
                                errors: [{ message: err.message }]
                            });
                        }
                    });
                }

                // Save basic eligibility data
                const basicEligibleData = {
                    lead_id,
                    basic_eligibility: basicEligibility,
                    lenders: lenderNames
                };

                BasicEligibleLender.create(basicEligibleData, (err) => {
                    if (err) {
                        console.error('Error saving basic eligibility data:', err);
                        return res.status(500).send({
                            status: 'failure',
                            message: 'Internal server error',
                            data: null,
                            errors: [{ message: err.message }]
                        });
                    }

                    // console.log('Eligibility check completed successfully');
                });
                res.status(200).send({
                    status: 'success',
                    message: 'Eligibility check completed',
                    data: { basic_eligibility: basicEligibility, lender_names: lenderNames, ineligible_reasons: ineligibleReasons },
                    errors: null
                });
            });
        });
    });
};

module.exports = { checkEligibility };