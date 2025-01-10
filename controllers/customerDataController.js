const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const Data = require('../models/CustomerDataModel');

// Configure multer to filter files based on their MIME type
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'text/csv') {
      return cb(new Error('Please upload a CSV file'), false);
    }
    cb(null, true);
  }
});

const uploadFile = (req, res) => {
  // Check if the file was filtered out by multer
  if (!req.file) {
    return res.status(400).json({ message: 'Please upload a CSV file' });
  }

  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => {
      try {
        const formattedData = {
          partner: data['Partner'] || '',
          mobile_no: data['Mobile Number'] || '',
          basic_elegibility: {
            loan_type: data['Loan Type'] || '',
            salary: parseFloat(data['Monthly Income']) || 0,
            age: calculateAge(data['DOB']),
            location: data['Pincode'] || ''
          },
          advance_elegibility: {
            avg_monthly_bank_balance: parseFloat(data['avg_monthly_bank_balance']) || 0,
            business_vintage: parseFloat(data['business_vintage']) || 0,
            business_turnover: parseFloat(data['business_turnover']) || 0
          },
          bureau: {
            cibil: {
              score: parseFloat(data['score']) || 0,
              max_dpd_30: parseFloat(data['max_dpd_30']) || 0,
              max_dpd_60: parseFloat(data['max_dpd_60']) || 0,
              max_dpd_90: parseFloat(data['max_dpd_90']) || 0,
              no_of_emi_bounces: parseFloat(data['no_of_emi_bounces']) || 0,
              balance_overdue_amount: parseFloat(data['Obligations']) || 0,
              enquiries_in_months: parseInt(data['enquiries_in_months']) || 0,
              write_offs_in_months: parseInt(data['write_offs_in_months']) || 0,
              max_current_os: parseFloat(data['max_current_os']) || 0,
              suit_filed_wilful_default: data['suit_filed_wilful_default'] || 'N/A',
              ntc_allowed: data['ntc_allowed'] || 'N/A'
            }
          },
          data: {
            lead_id: data['Lead ID'] || '',
            loan_no: data['Loan No'] || '',
            customer_id: data['Customer ID'] || '',
            customer_name: data['Customer Name'] || '',
            religion: data['Religion'] || '',
            pan_card: data['PanCard'] || '',
            otp_verification: data['OTP verification'] === 'true',
            user_type: data['User Type'] || '',
            company_name: data['Company Name'] || '',
            loan_applied: parseFloat(data['Loan Applied']) || 0,
            loan_recommended: parseFloat(data['Loan Recommended']) || 0,
            admin_fee: parseFloat(data['Admin Fee']) || 0,
            tenure: parseInt(data['Tenure']) || 0,
            interest: parseFloat(data['Interest']) || 0,
            repayment_amount: parseFloat(data['Repayment Amount']) || 0,
            repayment_date: parseDate(data['Repayment Date']),
            journey_type: data['Journey Type'] || '',
            application_journey_type: data['Application Journey Type'] || '',
            lead_source: data['Lead Source'] || '',
            utm_source: data['UTM Source'] || '',
            utm_medium: data['UTM Medium'] || '',
            utm_campaign: data['UTM Campaign'] || '',
            utm_term: data['UTM Term'] || '',
            dob: parseDate(data['DOB']),
            gender: data['Gender'] || '',
            branch: data['Branch'] || '',
            state: data['State'] || '',
            city: data['City'] || '',
            pincode: data['Pincode'] || '',
            trial_city: data['Trial City'] || '',
            status: data['Status'] || '',
            initiated_date_time: parseDate(data['Initiated DateTime']),
            docs_uploaded_by: data['Docs Uploaded By'] || '',
            screen_by: data['Screen By'] || '',
            screener_assign_date_time: parseDate(data['Screener Assign DateTime']),
            screener_recommended_date_time: parseDate(data['Screener Recommended DateTime']),
            sanction_by: data['Sanction By'] || '',
            sanction_assign_date_time: parseDate(data['Sanction Assign DateTime']),
            sanction_recommended_date_time: parseDate(data['Sanction Recommended DateTime']),
            sanction_approved_by: data['Sanction Approved By'] || '',
            sanction_approved_date_time: parseDate(data['Sanction Approved DateTime']),
            cam_save_date_time: parseDate(data['CAM SAVE DateTime']),
            customer_acceptance_date_time: parseDate(data['Customer Acceptance DateTime']),
            disbursal_by: data['Disbursal By'] || '',
            disbursal_assign_date_time: parseDate(data['Disbursal Assign DateTime']),
            disbursal_recommended_date_time: parseDate(data['Disbursal Recommended DateTime']),
            disbursal_approved_by: data['Disbursal Approved By'] || '',
            final_disbursed_date_time: parseDate(data['Final Disbursed DateTime']),
            rejected_reason: data['Rejected Reason'] || '',
            lead_rejected_assign_user_name: data['Lead Rejected Assign User Name'] || '',
            lead_rejected_assign_date_time: parseDate(data['Lead Rejected Assign Date Time']),
            lead_rejected_assign_counter: parseInt(data['Lead Rejected Assign Counter']) || 0,
            application_date: parseDate(data['Application Date']),
            application_status: data['Application Status'] || ''
          }
        };
        results.push(formattedData);
      } catch (err) {
        console.error('Error processing data row:', err);
      }
    })
    .on('end', async () => {
      try {
        // Batch insert data
        await Data.insertMany(results);
        // Delete the file after data is successfully stored
        fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error('Failed to delete file:', err);
          }
        });
        res.status(200).json({ message: 'File processed and data stored' });
      } catch (error) {
        console.error('Error inserting data into database:', error);
        res.status(500).json({ error: error.message });
      }
    })
    .on('error', (err) => {
      console.error('Error reading CSV file:', err);
      res.status(500).json({ error: 'Error reading CSV file' });
    });
};

// Function to calculate age from DOB
const calculateAge = (dob) => {
  const birthDate = new Date(dob);
  if (isNaN(birthDate)) return 0;
  const ageDifMs = Date.now() - birthDate.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

// Function to parse date fields
const parseDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date) ? null : date;
};

// Showing the stored Data
const getData = async (req, res) => {
  try {
    const data = await Data.find();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data from database:', error);
    res.status(500).json({ error: error.message });
  }
};

// Error handling middleware for multer
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError || err.message === 'Please upload a CSV file') {
    return res.status(400).json({ message: err.message });
  }
  next(err);
};

module.exports = { upload, uploadFile, handleMulterErrors, getData };
