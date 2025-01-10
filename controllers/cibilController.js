const multer = require('multer');
const xlsx = require('xlsx');
const { createCibilTable, insertCibilRecord } = require('../models/cibilModel');

const upload = multer({ dest: 'uploads/' });

const processFile = async (req, res) => {
    try {
        await createCibilTable();

        const file = req.file;
        const workbook = xlsx.readFile(file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        const uniqueMembers = new Set();
        const records = [];

        data.forEach((row) => {
            if (!uniqueMembers.has(row.MemberReference)) {
                uniqueMembers.add(row.MemberReference);
                // Convert date from DDMMYYYY to YYYY-MM-DD
                // const dateProcessed = String(row.DateProcessed);
                // const formattedDate = `${dateProcessed.slice(4, 8)}-${dateProcessed.slice(2, 4)}-${dateProcessed.slice(0, 2)}`;

                records.push({
                    member_reference: row.MemberReference,
                    date_processed: row.DateProcessed,
                    time_processed: row.TimeProcessed,
                    pancard: row.ID_Number,
                    score: row.score,
                    datas: row,
                });
            }
        });

        for (const record of records) {
            await insertCibilRecord(record);
        }

        res.status(200).json({
            status: 'success',
            message: 'Data processed and saved successfully',
             data: null,
             errors: null
            });
    } catch (error) {
        res.status(500).json({
            status: 'failure',
            message: 'Internal server error',
            data: null,
            errors: [{ message: err.message }]
            });
    }
};

module.exports = { upload, processFile };