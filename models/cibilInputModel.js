const db = require('../config/database');

const CibilInput = {};

CibilInput.create = (data, callback) => {
    const query = `INSERT INTO cibil_input (name, pancard, mobile, lead_id, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())`;
    db.query(query, [data.name, data.pancard, data.mobile, data.lead_id], callback);
};

module.exports = CibilInput;