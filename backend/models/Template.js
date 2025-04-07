const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  templateName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Students", "Staff","NonAcademicStaff", "BothStuandAcedamicStff","BothStuandStaff","Bothnonandacademic","all"],
  },
  duplicateSubmissionAllowed: {
    type: Boolean,
    default: false,
  },
  hierarchy: [
    {
      position: {
        type: String,
        required: true,
      }
    }
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
      optional:{
        type:Boolean,
        default: false
      },
      answerType: {
        type: String,
        required: true,
        enum: ["text", "checkbox", "textarea", "text-editor", "radio", "upload","single_date","single_date_future","duration","duration_future","doc_upload","media_upload"],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Template", templateSchema);
