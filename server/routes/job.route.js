const express = require('express');
const jobController = require('../controllers/job.controller');
const router = express.Router();

router.route('/').get(jobController.getAllJobs).post(jobController.addJob);
router.route('/:id').get(jobController.getJobById).patch(jobController.updateJob).delete(jobController.deleteJob);
module.exports = router;