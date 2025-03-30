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
        type: String,
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

module.exports = mongoose.model("Template", templateSchema);
