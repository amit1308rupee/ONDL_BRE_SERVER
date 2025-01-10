const Lender = require('../models/lenderModel');
const CibilInput = require('../models/cibilInputModel');

const checkEligibility = (req, res) => {
    const { pancard, name, mobile, salary, age, pincode, lead_id } = req.body;

    // Validate required fields
    const missingFields = [];
    if (!pancard) missingFields.push('pancard');
    if (!name) missingFields.push('name');
    if (!mobile) missingFields.push('mobile');
    if (!salary) missingFields.push('salary');
    if (!age) missingFields.push('age');
    if (!pincode) missingFields.push('pincode');
    if (!lead_id) missingFields.push('lead_id');
    if (missingFields.length > 0) {
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
            console.error('Error fetching lenders:', err);
            return res.status(500).send({
                status: 'failure',
                message: 'Internal server error',
                data: null,
                errors: [{ message: err.message }]
            });
        }

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



        const lenderNames = eligibleLenders.map(lender => lender.lender_name);
        const basicEligibility = lenderNames.length > 0;

        // Save data if any lender requires CIBIL and there are eligible lenders
        const requiresCibil = eligibleLenders.some(lender => lender.cibil_required);
        if (basicEligibility && requiresCibil) {
            const cibilData = { name, pancard, mobile, lead_id };
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

        res.status(200).send({
            status: 'success',
            message: 'Eligibility check completed',
            data: { basic_eligibility: basicEligibility, lender_names: lenderNames, ineligible_reasons: ineligibleReasons },
            errors: null
        });
    });
};

module.exports = { checkEligibility };