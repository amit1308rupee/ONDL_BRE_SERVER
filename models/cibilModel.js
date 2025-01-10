const connection = require('../config/database');

const createCibilTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS cibil (
            id INT AUTO_INCREMENT PRIMARY KEY,
            member_reference VARCHAR(255) NOT NULL UNIQUE,
            date_processed VARCHAR(255) NOT NULL,
            time_processed VARCHAR(255) NOT NULL,
            pancard VARCHAR(255) NOT NULL,
            score INT NOT NULL,
            datas JSON NOT NULL
        )
    `;
    try {
        const conn = await connection;
        await conn.query(query);
        console.log('CIBIL table created or already exists.');
    } catch (err) {
        console.error('Error creating CIBIL table:', err.message);
    }
};

const insertCibilRecord = async (record) => {
    const query = `
        INSERT INTO cibil (member_reference, date_processed, time_processed, pancard, score, datas)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
        record.member_reference,
        record.date_processed,
        record.time_processed,
        record.pancard,
        record.score,
        JSON.stringify(record.datas),
    ];
    try {
        const conn = await connection;
        await conn.query(query, values);
        console.log('CIBIL record inserted successfully.');
    } catch (err) {
        console.error('Error inserting CIBIL record:', err.message);
    }
};

module.exports = { createCibilTable, insertCibilRecord };