// server\models\job.js
const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  jobId: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: false
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    required: true
  },
  requirements: {
    type: String,
    required: true
  },
  responsibilities: {
    type: String,
    required: true
  },
  authorEmail: {
    type: String,
    required: true,
    ref: 'User'
  },
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['active', 'filled', 'expired', 'pending'], //active == show , filled == notShow (can delete now)
    //expired == delete from DB 
    default: 'pending'
  },
  // applicationUrl: {
  //   type: String,
  //   required: false
  // },
  applicationDeadline: {
    type: Date,
    required: false
  }
}, { timestamps: true });

// Generate unique job ID before validation
JobSchema.pre('validate', async function(next) {
  if (this.isNew && !this.jobId) {
    const lastJob = await mongoose.model('Job').findOne().sort({ jobId: -1 });
    let nextNum = 1;
    if (lastJob && lastJob.jobId) {
      const match = lastJob.jobId.match(/JOB-(\d+)/);
      if (match) {
        nextNum = parseInt(match[1]) + 1;
      }
    }
    this.jobId = `JOB-${nextNum.toString().padStart(4, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Job', JobSchema);