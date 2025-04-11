const Job = require('../models/job.model');


exports.getAllJobs = async (req, res) => {
    try {
        //1) Filtering
        console.log(`Req.query`, req.query);
        const queryObj = { ...req.query };
        const excludeFields = ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach(el => delete queryObj[el]);


        //2) Advanced Filtering
        let queryString = JSON.stringify(queryObj);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
        let parsedQuery = JSON.parse(queryString);

        // 2.5) Convert date strings to Date objects (handles nested gte/lt etc.)
        // This will convert any date_of_application[gte] or date_of_application[lte] to a Date object
        Object.keys(parsedQuery).forEach(key => {
            if (key.startsWith('date_of_application')) {
                const [field, op] = key.split('[');
                const operator = op.replace(']', '');
                if (!parsedQuery[field]) parsedQuery[field] = {};
                parsedQuery[field][`${operator}`] = new Date(parsedQuery[key]);
                delete parsedQuery[key];
            }
        });
        console.log(`Parsed Query:`, parsedQuery);

        //NOTE: as Job.find() for date expects a date object, we need to convert the string to a date object
        // example of date object , { date_of_application: { '$gte': 2025-03-25T12:00:00.000Z } }
        let query = Job.find(parsedQuery); //not awaiting this rn as it will get called and we want to add methods to it first


        //3) Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        }
        else {
            query = query.sort('-date_of_application');
        }
        //4) Field limiting
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }
        else {
            query = query.select('-__v -createdAt -updatedAt');
        }
        //5) Pagination
        const page = req.query.page * 1 || 1;
        const limit = req.query.limit * 1 || 50;
        query = query.skip((page - 1) * limit).limit(limit);
        if (req.query.page) {
            const numJobs = await Job.countDocuments();
            if ((page - 1) * limit >= numJobs) throw new Error('This page does not exist')
        }
        console.log(`Query: ${query}`);

        const filteredJobs = await query;
        res.status(200).json({
            status: 'success',
            result: filteredJobs.length,
            data: filteredJobs
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: true,
            message: err.message,
            error: err,
            stack: err.stack,
        });
    }
}
exports.getJobById = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({
                status: 'fail',
                message: 'No Job ID provided'
            });
        }
        const job = await Job.findById(req.params.id);
        if (!job) {
            return res.status(404).json({
                status: 'fail',
                message: 'No job found with that ID'
            })
        }
        res.status(200).json({
            status: 'success',
            data: job
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: true,
            message: err.message,
            error: err,
            stack: err.stack,
        });
    }
}



exports.addJob = async (req, res) => {
    try {
        const { company, role, status, date_of_application, link } = req.body;
        if (!company || !role || !status || !link || !date_of_application) {
            return res.status(400).json({
                error: true,
                message: 'All fields are required',
            });
        }
        // console.log('date_of_application', date_of_application, new Date(date_of_application));
        const job = await Job.create({
            company,
            role,
            status,
            date_of_application: new Date(date_of_application),
            link
        });
        res.status(201).json({
            status: 'success',
            message: 'Job created successfully',
            data: job
        })

    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: true,
            message: err.message,
            error: err,
            stack: err.stack,
        });
    }
}
exports.updateJob = async (req, res) => {
    try {
        console.log('params: ', req.params.id);
        if (!req.params.id) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide job ID !'
            })
        }
        const job = await Job.findById(req.params.id);
        console.log('Job from update job', job);
        if (!job) {
            return res.status(404).json({
                status: 'fail',
                message: 'No job found with that ID'
            })
        }
        job.set({
            company: req.body.company ? req.body.company : job.company,
            role: req.body.role ? req.body.role : job.role,
            status: req.body.status ? req.body.status : job.status,
            date_of_application: req.body.date_of_application ? req.body.date_of_application : new Date(job.date_of_application),
            link: req.body.link ? req.body.link : job.link,
        })
        job.markModified('date_of_application');
        await job.save();
        res.status(200).json({
            status: 'success',
            message: 'Job updated successfully',
            data: job
        })

    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: true,
            message: err.message,
            error: err,
            stack: err.stack,
        });
    }
}
exports.deleteJob = async (req, res) => {
    try {
        console.log('params from delete job : ', req.params,);
        if (!req.params.id) {
            return res.status(400).json({
                status: 'fail',
                message: 'Please provide job ID !'
            })
        }
        await Job.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            message: 'Job deleted successfully',
            data: null
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            error: true,
            message: err.message,
            error: err,
            stack: err.stack,
        });
    }
}