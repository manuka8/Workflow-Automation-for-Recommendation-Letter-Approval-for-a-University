const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const Staff = require("../models/Staff");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Submitted = require('../models/Submitted');
const bcrypt = require("bcrypt");

router.get("/:id", async (req, res) => {
    const { userType } = req.query;
    const Model = userType === "student" ? Student : Staff;
    
    const userIdField = userType === "student" ? "studentId" : "staffId";
  
    try {
      const user = await Model.findOne({ [userIdField]: req.params.id }).select("-password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });
  
  
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, "../uploads/profile_pic");
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, req.params.id + path.extname(file.originalname)); 
    },
  });
  
  const upload = multer({ storage });
  
  
router.put("/picture/:id", upload.single("profilePicture"), async (req, res) => {
    const { userType } = req.query;
    const Model = userType === "student" ? Student : Staff;
    const userIdField = userType === "student" ? "studentId" : "staffId";
    try {
      
      const user = await Model.findOne({ [userIdField]: req.params.id });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      
      if (user.profilePicture) {
        const previousImagePath = path.join(__dirname, "..", user.profilePicture);
        if (fs.existsSync(previousImagePath)) {
          fs.unlinkSync(previousImagePath); 
        }
      }
  
      
      user.profilePicture = `/uploads/profile_pic/${req.file.filename}`;
      await user.save();
  
      res.json({ profilePicture: user.profilePicture });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({ message: "Error updating profile picture" });
    }
  });
  
  router.put("/change-password/:id", async (req, res) => {
    try {
      const { userType, currentPassword, newPassword } = req.body;
  
      if (!userType || !currentPassword || !newPassword) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const Model = userType === "student" ? Student : Staff;
      const userIdField = userType === "student" ? "studentId" : "staffId";
  
      const user = await Model.findOne({ [userIdField]: req.params.id });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect current password" });
      }
  
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ message: "New password cannot be the same as the old password" });
      }
  
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      user.password = hashedPassword;
      await user.save();
  
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  router.get("/info/:id", async (req, res) => {
    try {
      let user = null;
      let userType = null;
  
      const student = await Student.findOne({ studentId: req.params.id });
      if (student) {
        user = student;
        userType = "student";
      } else {
        const staff = await Staff.findOne({ staffId: req.params.id });
        if (staff) {
          user = staff;
          userType = "staff"; 
        }
      }
  
      if (user) {
        res.json({ user, userType }); 
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  
  router.get('/user-counts', async (req, res) => {
    const studentCount = await Student.countDocuments();
    const staffCount = await Staff.countDocuments();
    res.json({ studentCount, staffCount });
  });
  
  router.get('/staff-counts', async (req, res) => {
    const academicStaffCount = await Staff.countDocuments({ staffType: 'academic' });
    const nonAcademicStaffCount = await Staff.countDocuments({ staffType: 'non-academic' });
    res.json({ academicStaffCount, nonAcademicStaffCount });
  });
  
  router.get('/submission-counts', async (req, res) => {
    const submissionCounts = await Submitted.aggregate([
      { $group: { _id: "$templateId", count: { $sum: 1 } } }
    ]);
    res.json(submissionCounts);
  });
  
  module.exports = router;