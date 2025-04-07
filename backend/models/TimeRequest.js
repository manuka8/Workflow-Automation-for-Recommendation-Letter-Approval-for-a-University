const mongoose = require('mongoose');

const timeRequestSchema = new mongoose.Schema({
  resubmissionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Resubmission",
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  requestingAdditionalTime: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('TimeRequest', timeRequestSchema);
