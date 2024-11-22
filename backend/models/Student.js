const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true }, // Unique Student ID
  faculty: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },  // Unique email
  position: { type: String, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true }
});

// Hash the password before saving the student model
studentSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare given password with database hash
studentSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Student', studentSchema);
