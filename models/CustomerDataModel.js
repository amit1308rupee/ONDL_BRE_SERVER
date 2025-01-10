const mongoose = require('mongoose');

// Define subschemas
const basic_elegibility_schema = new mongoose.Schema({
  loan_type: { type: String, default: '' },
  salary: { type: Number, default: 0 },
  age: { type: Number, default: 0 }, // This will be calculated from DOB
  location: { type: String, default: '' }
});

const advance_elegibility_schema = new mongoose.Schema({
  avg_monthly_bank_balance: { type: Number, default: 0 },
  business_vintage: { type: Number, default: 0 },
  business_turnover: { type: Number, default: 0 }
});

const cibil_schema = new mongoose.Schema({
  score: { type: Number, default: 0 },
  max_dpd_30: { type: Number, default: 0 },
  max_dpd_60: { type: Number, default: 0 },
  max_dpd_90: { type: Number, default: 0 },
  no_of_emi_bounces: { type: Number, default: 0 },
  balance_overdue_amount: { type: Number, default: 0 },
  enquiries_in_months: { type: Number, required: true },
  write_offs_in_months: { type: Number, required: true },
  max_current_os: { type: Number, required: true },
  suit_filed_wilful_default: { type: String, required: true },
  ntc_allowed: { type: String, required: true }
});

const bureau_schema = new mongoose.Schema({
  cibil: cibil_schema
});

// Define main schema
const data_schema = new mongoose.Schema({
  partner: { type: String, default: '' },
  mobile_no: { type: String, default: '' },
  basic_elegibility: basic_elegibility_schema,
  advance_elegibility: advance_elegibility_schema,
  bureau: bureau_schema,
  data: {
    lead_id: { type: String, default: '' },
    loan_no: { type: String, default: '' },
    customer_id: { type: String, default: '' },
    customer_name: { type: String, default: '' },
    religion: { type: String, default: '' },
    pan_card: { type: String, default: '' },
    otp_verification: { type: Boolean, default: false },
    user_type: { type: String, default: '' },
    company_name: { type: String, default: '' },
    loan_applied: { type: Number, default: 0 },
    loan_recommended: { type: Number, default: 0 },
    admin_fee: { type: Number, default: 0 },
    tenure: { type: Number, default: 0 },
    interest: { type: Number, default: 0 },
    repayment_amount: { type: Number, default: 0 },
    repayment_date: { type: Date, default: null },
    journey_type: { type: String, default: '' },
    application_journey_type: { type: String, default: '' },
    lead_source: { type: String, default: '' },
    utm_source: { type: String, default: '' },
    utm_medium: { type: String, default: '' },
    utm_campaign: { type: String, default: '' },
    utm_term: { type: String, default: '' },
    dob: { type: Date, default: null },
    gender: { type: String, default: '' },
    branch: { type: String, default: '' },
    state: { type: String, default: '' },
    city: { type: String, default: '' },
    pincode: { type: String, default: '' },
    trial_city: { type: String, default: '' },
    status: { type: String, default: '' },
    initiated_date_time: { type: Date, default: null },
    docs_uploaded_by: { type: String, default: '' },
    screen_by: { type: String, default: '' },
    screener_assign_date_time: { type: Date, default: null },
    screener_recommended_date_time: { type: Date, default: null },
    sanction_by: { type: String, default: '' },
    sanction_assign_date_time: { type: Date, default: null },
    sanction_recommended_date_time: { type: Date, default: null },
    sanction_approved_by: { type: String, default: '' },
    sanction_approved_date_time: { type: Date, default: null },
    cam_save_date_time: { type: Date, default: null },
    customer_acceptance_date_time: { type: Date, default: null },
    disbursal_by: { type: String, default: '' },
    disbursal_assign_date_time: { type: Date, default: null },
    disbursal_recommended_date_time: { type: Date, default: null },
    disbursal_approved_by: { type: String, default: '' },
    final_disbursed_date_time: { type: Date, default: null },
    rejected_reason: { type: String, default: '' },
    lead_rejected_assign_user_name: { type: String, default: '' },
    lead_rejected_assign_date_time: { type: Date, default: null },
    lead_rejected_assign_counter: { type: Number, default: 0 },
    application_date: { type: Date, default: null },
    application_status: { type: String, default: '' }
  }
});

module.exports = mongoose.model('Data', data_schema);