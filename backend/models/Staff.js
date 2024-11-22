const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const staffSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true }, // Unique Staff ID
  type: { 
    type: String, 
    required: true, 
    enum: ['academic', 'non-academic'] // Dropdown with specific values
  },
  faculty: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },  // Unique email
  position: { type: String, required: true },
  password: { type: String, required: true },
  confirmPassword: { type: String, required: true }
});

// Hash the password before saving the staff model
staffSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare given password with database hash
staffSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('Staff', staffSchema);
