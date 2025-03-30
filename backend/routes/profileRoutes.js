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
  