const mongoose = require('mongoose');

const StaffSchema = new mongoose.Schema({
  staffId: { type: String, required: true, unique: true },
  firstName: {type: String,required: true,trim: true},
  lastName: { type: String,required: true,trim: true},
  staffType: { type: String, required: true },
  faculty: { type: String, required: true },
  department: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  position: { type: String, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String, default: "" },
}, { timestamps: true });

const Staff = mongoose.model('Staff', StaffSchema);

module.exports = Staff;