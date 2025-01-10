const mongoose = require('mongoose');

const basic_eligibility_schema = new mongoose.Schema({
    loan_type: { type: String, required: true },
    salary: { type: Number, required: true },
    age_min: { type: Number, required: true },
    age_max: { type: Number, required: true },
    location_range: { type: [Number], required: true }, // Array of pincodes
    lender: { type: String, required: true }
});

const advance_eligibility_schema = new mongoose.Schema({
    avg_monthly_bank_balance: { type: Number, required: true },
    business_vintage: { type: Number, required: true },
    business_turnover: { type: Number, required: true }
});

const bureau_schema = new mongoose.Schema({
    cibil: {
        score: { type: Number, required: true },
        max_dpd_30: { type: Number, required: true },
        max_dpd_60: { type: Number, required: true },
        max_dpd_90: { type: Number, required: true },
        no_of_emi_bounces: { type: Number, required: true },
        balance_overdue_amount: { type: Number, required: true },
        enquiries_in_months: { type: Number, required: true },
        write_offs_in_months: { type: Number, required: true },
        max_current_os: { type: Number, required: true },
        suit_filed_wilful_default: { type: String, required: true },
        ntc_allowed: { type: String, required: true }
    },
    equifax: {
        score: { type: Number, required: true },
        max_dpd_30: { type: Number, required: true },
        max_dpd_60: { type: Number, required: true },
        max_dpd_90: { type: Number, required: true },
        no_of_emi_bounces: { type: Number, required: true },
        balance_overdue_amount: { type: Number, required: true },
        enquiries_in_months: { type: Number, required: true },
        write_offs_in_months: { type: Number, required: true },
        max_current_os: { type: Number, required: true },
        suit_filed_wilful_default: { type: String, required: true },
        ntc_allowed: { type: String, required: true }
    },
    crif: {
        score: { type: Number, required: true },
        max_dpd_30: { type: Number, required: true },
        max_dpd_60: { type: Number, required: true },
        max_dpd_90: { type: Number, required: true },
        no_of_emi_bounces: { type: Number, required: true },
        balance_overdue_amount: { type: Number, required: true },
        enquiries_in_months: { type: Number, required: true },
        write_offs_in_months: { type: Number, required: true },
        max_current_os: { type: Number, required: true },
        suit_filed_wilful_default: { type: String, required: true },
        ntc_allowed: { type: String, required: true }
    }
});

const breSchema = new mongoose.Schema({
    basic_eligibility: basic_eligibility_schema,
    advance_eligibility: advance_eligibility_schema,
    bureau: bureau_schema
});

const BREConfig = mongoose.model('BREConfig', breSchema);
module.exports = BREConfig;