const express = require('express');
const cors = require('cors');
const jobRouter = require('./routes/job.route');

const app = express();
app.use(express.json());
corsOptions = {
    // origin: 'http://localhost:3000',
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
}
app.use(cors(corsOptions));

//ROUTES
app.use('/api/v1/jobs', jobRouter);


module.exports = app;