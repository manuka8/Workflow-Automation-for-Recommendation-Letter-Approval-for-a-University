const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  templateId: {
    type: String,
    unique: true,
  },
  templateName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["Students", "Staff"], 
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
    },
  ],
  questions: [
    {
      question: {
        type: String
      },
      answerType: {
        type: String,
        enum: ["text", "checkbox", "radio", "upload"],
      },
      options: [
        {
          type: String,
        },
      ],
      visibility: {
        type: String,
        default: "all",
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

templateSchema.pre("save", function (next) {
  if (!this.templateId) {
    this.templateId = `TPL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model("Template", templateSchema);
