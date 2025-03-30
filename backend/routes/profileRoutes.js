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
  