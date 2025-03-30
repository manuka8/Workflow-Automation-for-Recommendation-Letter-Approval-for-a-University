const mongoose = require("mongoose");

const submittedSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Template", 
    required: true,
  },
  hierarchy: [
    {
      position: {
        type: String,
        required: true,
      },
      staffId: {
        type: String,
        required: true,
      },
      approved: {
        type: Boolean,
        default: false,
      },
      pending: {
        type: Boolean,
        default: false,
      },
    },
  ],
  questions: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
      visibility: {
        type: String,
        default: "all",
      },
    },
  ],
  resubmit: {
    type: Boolean,
    default: false,
  },
  reject: {
    type: Boolean,
    default: false,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.models.Submitted || mongoose.model("Submitted", submittedSchema);
