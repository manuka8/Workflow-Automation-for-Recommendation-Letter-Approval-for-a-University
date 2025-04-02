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

module.exports = router;
