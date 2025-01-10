const db = require('../config/database');

const Lender = {};

Lender.create = (data, callback) => {
    const query = `INSERT INTO lender_bre (lender_name, min_age, max_age, min_salary, pin_range, cibil_required) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(query, [data.lender_name, data.min_age, data.max_age, data.min_salary, data.pin_range, data.cibil_required?1:0], callback);
};

module.exports = Lender;