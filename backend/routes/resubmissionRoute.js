const express = require('express');
const Submission = require('../models/Submitted');
const router = express.Router();
const Staff = require("../models/Staff");
const Resubmission = require('../models/Resubmission');
const Template = require('../models/Template');
const Student = require("../models/Student");

router.post('/:submissionId', async (req, res) => {
    const { submissionId } = req.params;
    const { note, deadline, staffId } = req.body;
  
    try {
      const submitted = await Submission.findById(submissionId);
  
      if (!submitted) {
        return res.status(404).json({ error: 'Submission not found.' });
      }
  
      submitted.resubmit = true;
  
      const hierarchyItem = submitted.hierarchy.find(item => item.staffId === staffId);
      if (hierarchyItem) {
        hierarchyItem.pending = true;
      } else {
        return res.status(400).json({ error: 'Staff ID not found in hierarchy.' });
      }
  
      await submitted.save();
  
      
      const resubmission = new Resubmission({
        userId: submitted.userId,
        submissionId: submitted._id, 
        note,
        deadline,
        staffId,
      });
  
      const savedResubmission = await resubmission.save();

      if (savedResubmission) {
        let userEmail;
        const student = await Student.findOne({ studentId: submitted.userId });
        if (student) {
          userEmail = student.email;
        } else {
          const staff = await Staff.findOne({ staffId: submitted.userId });
          if (staff) {
            userEmail = staff.email;
          }
        }
  
        if (userEmail) {
          const subject = "Resubmission Request";
          const message = `Dear User,\n\nYour submission has been marked for resubmission. \nResubmission ID: ${savedResubmission._id}\n\nPlease review and resubmit before the deadline: ${new Date(deadline).toLocaleDateString()}.\n\nBest regards,\nSubmission Team`;
          console.log('Email sent')
          await sendEmail(userEmail, subject, message);
        }
      }
  
      res.status(200).json({ message: "Resubmission saved successfully and user notified." });
    } catch (error) {
      console.error('Error processing resubmission:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

  module.exports = router;