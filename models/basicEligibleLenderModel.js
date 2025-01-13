const db = require('../config/database');

const BasicEligibleLender = {};

// Function to create a new BasicEligibleLender
BasicEligibleLender.create = async (basicEligibleLenderData) => {
    const { lead_id, basic_eligibility, lenders } = basicEligibleLenderData;
    const query = 'INSERT INTO basic_eligible_lender (lead_id, basic_eligibility, lenders) VALUES (?, ?, ?)';
      db.query(query, [lead_id, basic_eligibility, JSON.stringify(lenders)]);
   
};

// Function to find a BasicEligibleLender by lead_id
BasicEligibleLender.findByLeadId = (lead_id, callback) => {
    const query = 'SELECT * FROM basic_eligible_lender WHERE lead_id = ?';
    db.query(query, [lead_id], (err, results) => {
        if (err) return callback(err, null);
        if (results.length > 0) return callback(null, results[0]);
        return callback(null, null);
    });
};

module.exports = BasicEligibleLender;