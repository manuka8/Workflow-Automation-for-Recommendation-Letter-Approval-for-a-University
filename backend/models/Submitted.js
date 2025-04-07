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
      note: {
        type: String,
        default: "",
        validate: {
          validator: function (val) {
            return !this.includeNote || (val && val.trim().length > 0);
          },
          message: "If a note is included, it cannot be empty.",
        },
      },
      answerType: {
        type: String,
        required: true,
        enum: ["text", "checkbox", "textarea", "text-editor", "radio", "upload","single_date","single_date_future","duration","duration_future","doc_upload","media_upload"],
      },
      answer: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
      },
      visibility: {
        type: String,
        default: "all",
      },
      options: [
        {
          type: String,
        },
      ],
      hideVisibility: [{
        type: String,
        default: []
      }]
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
