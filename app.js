const express = require('express');
const morgan = require('morgan');
const cors = require('cors'); 
// const breRoutes = require('./routes/breRoutes');
// const fileRoutes = require('./routes/customerDataRoutes');
const { handleMulterErrors } = require('./controllers/customerDataController');
const cibilRoutes = require('./routes/cibilRoutes');
const lenderRoutes = require('./routes/lenderRoutes');
const eligibilityRoutes = require('./routes/basicEligibilityRoutes');

const app = express();

// Middleware
app.use(morgan('dev'));
app.use(express.json());
app.use(cors())

// Routes
// app.use('/api', breRoutes);
// app.use('/api', fileRoutes);
app.use('/api', cibilRoutes);
app.use('/api', lenderRoutes);
app.use('/api', eligibilityRoutes);

// Error handling middleware
app.use(handleMulterErrors);



module.exports = app;
