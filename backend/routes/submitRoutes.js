const express = require('express');
const router = express.Router();
const Submitted = require('../models/Submitted');
const Template = require('../models/Template');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/files/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", upload.array("files"), async (req, res) => {
  try {
    const parsedData = JSON.parse(req.body.data);
    const { userId, templateId, questions, selectedHierarchy } = parsedData;

   
    if (!userId || !templateId || !questions || !Array.isArray(selectedHierarchy)) {
      return res.status(400).json({
        message: "User ID, template ID, questions, and hierarchy are required.",
      });
    }

    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ message: "Template not found." });
    }

    if (!template.duplicateSubmissionAllowed) {
      const existingSubmission = await Submitted.findOne({ userId, templateId });
      if (existingSubmission) {
        return res.status(400).json({
          message: "You have already submitted this form.",
        });
      }
    }

    const processedQuestions = questions.map((q) => {
      if (q.answerType === "doc_upload" || q.answerType === "media_upload") {
        const uploadedFile = req.files.find((file) => file.originalname === q.answer);
        if (uploadedFile) {
          return { ...q, answer: `uploads/files/${uploadedFile.filename}` }; // Use the same filename
        }
      }
      return q;
    });


    const submission = new Submitted({
      userId,
      templateId,
      hierarchy: selectedHierarchy.map(({ staffId, position, department, faculty }) => ({
        staffId,
        position,
        department,
        faculty,
      })),
      questions: processedQuestions, 
    });

    await submission.save();

    res.status(201).json({
      message: "Submission saved successfully.",
      submissionId: submission._id,
    });
  } catch (err) {
    console.error("Error saving submission:", err);
    res.status(500).json({
      message: "Failed to save submission.",
      error: err.message,
    });
  }
});

router.get("/view-details/:submittedId", async (req, res) => {
  try {
    const { submittedId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(submittedId)) {
      return res.status(400).json({ message: "Invalid submission ID" });
    }

    const submission = await Submitted.findById(submittedId).populate("templateId");
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const resubmission = await Resubmission.findOne({ submissionId: submittedId });

    const response = {
      templateName: submission.templateId.templateName,
      submittedAt: submission.submittedAt,
      hierarchy: submission.hierarchy,
      isRejected: submission.reject,
      isResubmission: !!resubmission,
      resubmissionId: resubmission ? resubmission._id : null,
    };

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;