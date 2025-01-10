const db = require('../config/database');

const Lender = {};

Lender.create = (data, callback) => {
    const query = `INSERT INTO lender_bre (lender_name, min_age, max_age, min_salary, pin_range, cibil_required, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
    db.query(query, [data.lender_name, data.min_age, data.max_age, data.min_salary, data.pin_range, data.cibil_required ? 1 : 0], callback);
};

Lender.findByName = (lender_name, callback) => {
    const query = `SELECT * FROM lender_bre WHERE lender_name = ?`;
    db.query(query, [lender_name], (err, results) => {
        if (err) return callback(err, null);
        if (results.length > 0) return callback(null, results[0]);
        return callback(null, null);
    });
};

Lender.findAll = (callback) => {
    const query = `SELECT * FROM lender_bre`;
    db.query(query, [], (err, results) => {
        if (err) return callback(err, null);
        return callback(null, results);
    });
};

module.exports = Lender;