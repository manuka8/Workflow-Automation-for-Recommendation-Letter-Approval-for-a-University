const mongoose = require('mongoose');

const resubmissionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  submissionId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Submitted", 
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  staffId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['finished', 'not finished'],
    default: 'not finished',
  },
  isRequestMoreTime: {
    type: Boolean,
    default: false,
  },
  reason: {
    type: String,
    default: null,
  },
});

module.exports = mongoose.model('Resubmission', resubmissionSchema);
