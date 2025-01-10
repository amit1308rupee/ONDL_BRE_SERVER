const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const app = require('./app2');
// const connectDB = require('./config/db');

// // Connect to the database
// connectDB();

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});
