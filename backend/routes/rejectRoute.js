const express = require("express");
const router = express.Router();
const Submitted = require("../models/Submitted");
const Student = require("../models/Student");
const Staff = require("../models/Staff");
const sendEmail = require("../utils/sendEmail"); 
router.post("/rejectSubmission", async (req, res) => {
  const { submissionId, rejectReason } = req.body;

  try {
    const submission = await Submitted.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found." });
    }

    const user = await Student.findOne({ studentId: submission.userId }) || await Staff.findOne({ staffId: submission.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const emailSubject = "Your Submission Has Been Rejected";
    const emailMessage = `Your submission has been rejected for the following reason:\n\n${rejectReason}`;

    await sendEmail(user.email, emailSubject, emailMessage);

    await Submitted.findByIdAndDelete(submissionId);

    res.status(200).json({ message: "Submission rejected and email sent." });
  } catch (error) {
    console.error("Error rejecting submission:", error);
    res.status(500).json({ message: "An error occurred while rejecting the submission." });
  }
});

module.exports = router;