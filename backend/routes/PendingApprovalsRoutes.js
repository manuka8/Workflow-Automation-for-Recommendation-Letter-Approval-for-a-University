const express = require('express');
const router = express.Router();
const Submitted = require('../models/Submitted');
const Student = require("../models/Student");
const Staff = require("../models/Staff");
const sendEmail = require('../utils/sendEmail');

router.get('/submissions-by-staff', async (req, res) => {
  const { staffId } = req.query;

  if (!staffId) {
    return res.status(400).json({ error: 'staffId is required.' });
  }

  try {
    const submissions = await Submitted.find({
      "hierarchy.staffId": staffId,
    }).populate({
      path: "templateId",
      select: "templateName",
    });

    const pendingSubmissions = submissions.filter((submission) => {
      return submission.hierarchy.some((step, index) => {
        if (step.staffId === staffId) {
          const allPreviousApproved = submission.hierarchy
            .slice(0, index)
            .every((prevStep) => prevStep.approved === true);

          return (
            allPreviousApproved &&
            !step.approved &&
            !step.pending &&
            !submission.reject
          );
        }
        return false;
      });
    });

    const response = pendingSubmissions.map((submission) => ({
      submissionId: submission._id,
      userId: submission.userId,
      submittedAt: submission.submittedAt,
      templateName: submission.templateId?.templateName || "N/A", // Add fallback for missing templateName
    }));

    res.json({ submissions: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
router.get('/questions/:id', async (req, res) => {
    try {
      const submissionId = req.params.id;
      const { staffId } = req.query;
      const staff = await Staff.findOne({ staffId });
      if (!staffId) {
        return res.status(400).json({ error: 'staffId is required' });
      }
  
      const submission = await Submitted.findById(submissionId);
  
      if (!submission) {
        return res.status(404).json({ error: 'Submission not found' });
      }
  
      const hierarchy = submission.hierarchy;
      const finalStep = hierarchy[hierarchy.length - 1];
      const isFinalStep = finalStep && finalStep.staffId === staffId;
  
      const filteredQuestions = submission.questions.map((q) => {
        
        if (q.visibility === 'all' || q.visibility.split(',').includes(staffId)) {
          return q;
        }
        return null;
      }).filter(q => q !== null); 
      res.status(200).json({
        submission,
        submissionId: submission._id,
        questions: filteredQuestions,
        isFinalStep,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  router.put("/:id/approve", async (req, res) => {
    try {
      const { id } = req.params;
      const { staffId } = req.body;
  
      if (!staffId) {
        return res.status(400).json({ error: "staffId is required" });
      }
  
      const submission = await Submitted.findById(id);
  
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
  
      const hierarchyItem = submission.hierarchy.find(
        (item) => item.staffId === staffId
      );
  
      if (!hierarchyItem) {
        return res.status(404).json({ error: "Staff not found in hierarchy" });
      }
  
      hierarchyItem.approved = true;
      hierarchyItem.pending = false;
      await submission.save();
      const allApproved = submission.hierarchy.every((item) => item.approved === true);
      console.log(allApproved)
      if (allApproved) {
        let user = await Student.findOne({ studentId: submission.userId })|| await Staff.findOne({staffId:submission.userId});
        console.log(user);
        if (!user) {
          user = await Staff.findOne({ staffId: submission.userId }); 
        }
  
        if (user) {
          await sendEmail(
            user.email,
            "Final Submission Approved",
            `Your submission with ID ${id}  has been fully approved.`
          );
          console.log(`Email Sent to ${user.email}`)
        }
      }
  
      await submission.save();
  
      res.status(200).json({ message: "Approved successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
module.exports = router;
