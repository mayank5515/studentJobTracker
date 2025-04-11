const mongoose = require('mongoose');
const JobSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, 'Job must have a company name'],
    },
    role: {
        type: String,
        required: [true, 'Job must have a role'],
    },
    status: {
        type: String,
        enum: ['applied', 'interview', 'offer', 'rejected'],
        default: 'applied',
        required: [true, 'Job must have a status'],
    },
    date_of_application: {
        type: Date,
        default: Date.now,
    },
    link: {
        type: String,
        required: [true, 'Job must have a link'],
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true },
});

const Job = mongoose.model('Job', JobSchema);
module.exports = Job;