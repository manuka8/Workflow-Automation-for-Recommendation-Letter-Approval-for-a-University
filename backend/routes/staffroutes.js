const express = require("express");
const bcrypt = require("bcryptjs");
const Staff = require("../models/Staff");
const { generateToken, authenticate } = require("../security/auth");
const Student = require("../models/Student");
const nodemailer = require("nodemailer");

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { staffId, staffType, faculty, department, email, position, password } = req.body;

    const existingStaff = await Staff.findOne({ $or: [{ staffId }, { email }] });
    if (existingStaff) {
      return res.status(400).json({ message: 'Staff ID or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new Staff({
      staffId,
      staffType,
      faculty,
      department,
      email,
      position,
      password: hashedPassword,
    });

    await newStaff.save();

    const token = generateToken({ id: newStaff._id });

    res.status(201).json({ message: 'Staff registered successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { staffId, password } = req.body;

    const staff = await Staff.findOne({ staffId });
    if (!staff) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: staff._id });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/profile', authenticate, async (req, res) => {
  try {
    const staff = await Staff.findById(req.user.id).select('-password'); 
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
router.get("/selectstaff", async (req, res) => {
  const { staffType } = req.query;
  const staff = await Staff.find(staffType ? { staffType } : {});
  res.json(staff);
});
router.get("/selectstudent", async (req, res) => {
  const { staffType } = req.query;
  const staff = await Student.find();
  res.json(staff);
});
router.get("/findallstaff", async (req, res) => {
  try {
    const staff = await Staff.find(); 
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
