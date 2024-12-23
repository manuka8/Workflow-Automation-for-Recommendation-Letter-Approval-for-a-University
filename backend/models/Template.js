const mongoose = require("mongoose");

const templateSchema = new mongoose.Schema({
  templateId: {
    type: String,
    unique: true,
  },
templateName: {
type: String,
required: true,
@@ -31,7 +27,7 @@ const templateSchema = new mongoose.Schema({
questions: [
{
question: {
        type: String
        type: String,
},
answerType: {
type: String,
@@ -54,11 +50,5 @@ const templateSchema = new mongoose.Schema({
},
});

templateSchema.pre("save", function (next) {
  if (!this.templateId) {
    this.templateId = `TPL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model("Template", templateSchema);
