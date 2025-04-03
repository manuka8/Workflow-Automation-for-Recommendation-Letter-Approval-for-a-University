const express = require('express');
const router = express.Router();
const Submitted = require('../models/Submitted');
const Template = require('../models/Template');
const multer = require('multer');
const Submitted = require('../models/Submitted');
const Resubmission = require('../models/Resubmission')

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
router.get("/findstaffsubmissions/:staffId", async (req, res) => {
  const { staffId } = req.params;

  try {
    const submissions = await Submitted.find({
      hierarchy: { $elemMatch: { staffId } },
    })
      .populate("templateId", "templateName") 
      .sort({ submittedAt: -1 }); 

    if (!submissions.length) {
      return res.status(404).json({ message: "No submissions found for this staff member." });
    }

    const formattedSubmissions = submissions.map((submission) => ({
      _id: submission._id,
      templateName: submission.templateId.templateName,
      userId: submission.userId,
      submittedAt: submission.submittedAt,
      hierarchy: submission.hierarchy,
      status: calculateStatus(submission, staffId),
    }));

    res.status(200).json(formattedSubmissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "An error occurred while fetching submissions." });
  }
});

const calculateStatus = (submission, staffId) => {
  const hierarchy = submission.hierarchy;
  const index = hierarchy.findIndex((h) => h.staffId === staffId);

  if (index > 0 && !hierarchy[index - 1].approved) return "Waiting Progress";
  if (!hierarchy[index].approved && hierarchy[index].pending) return "Waiting for your approval";
  if (hierarchy[index].approved) return "Approved";
  if (hierarchy.some((h) => h.pending)) return "Pending Resubmission";
  return "Waiting Resubmission of You";
};

router.get("/viewhistory/:id", async (req, res) => {
  try {
    const submission = await Submitted.findById(req.params.id).populate("templateId", "templateName");
    
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    
    res.json(submission);
  } catch (error) {
    console.error("Error fetching submission:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;