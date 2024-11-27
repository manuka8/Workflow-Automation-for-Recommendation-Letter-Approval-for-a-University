const mongoose = require('mongoose');

// Define the Staff schema
const StaffSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },
  staffType: { type: String, required: true },
  faculty: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  password: { type: String, required: true },
}, { timestamps: true });

// Export the model
const Staff = mongoose.model('Staff', StaffSchema);

module.exports = Staff;