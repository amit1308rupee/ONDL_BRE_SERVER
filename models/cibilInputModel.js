const db = require('../config/database');

const CibilInput = {};

CibilInput.create = (data, callback) => {
    const query = `INSERT INTO cibil_input (name, pancard, mobile, lead_id, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`;
    db.query(query, [data.name, data.pancard, data.mobile, data.lead_id], callback);
};

// Function to find a CibilInput by lead_id
CibilInput.findByLeadId = (lead_id, callback) => {
    const query = 'SELECT * FROM cibil_input WHERE lead_id = ?';
    db.query(query, [lead_id], (err, results) => {
        if (err) return callback(err, null);
        if (results.length > 0) return callback(null, results[0]);
        return callback(null, null);
    });
};

module.exports = CibilInput;