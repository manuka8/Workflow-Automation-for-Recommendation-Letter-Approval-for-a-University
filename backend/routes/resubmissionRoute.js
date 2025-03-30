const express = require('express');
const mongoose = require('mongoose');
const Staff = require("../models/Staff");
const Resubmission = require('../models/Resubmission');
const Submission = require('../models/Submitted');
const Template = require('../models/Template');
const TimeRequest = require('../models/TimeRequest');
const router = express.Router();
const sendEmail = require("../utils/sendEmail"); // Import sendEmail utility
const Student = require("../models/Student");



router.post("/:submissionId", async (req, res) => {
  const { submissionId } = req.params;
  const { note, deadline, staffId } = req.body;

  try {
    const submitted = await Submission.findById(submissionId);

    if (!submitted) {
      return res.status(404).json({ error: "Submission not found." });
    }

    submitted.resubmit = true;

    const hierarchyItem = submitted.hierarchy.find((item) => item.staffId === staffId);
    if (hierarchyItem) {
      hierarchyItem.pending = true;
    } else {
      return res.status(400).json({ error: "Staff ID not found in hierarchy." });
    }

    await submitted.save();

    // Create and save new resubmission entry
    const resubmission = new Resubmission({
      userId: submitted.userId,
      submissionId: submitted._id,
      note,
      deadline,
      staffId,
    });

    const savedResubmission = await resubmission.save();

    // If resubmission is successfully saved, send an email
    if (savedResubmission) {
      // Find user email (Check in Student, if not found, check Staff)
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
    console.error("Error processing resubmission:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});


router.get('/findresubmissions/:resubmissionId', async (req, res) => {
  try {
    const { resubmissionId } = req.params;

    const resubmission = await Resubmission.findById(resubmissionId);

    if (!resubmission) {
      return res.status(404).json({ message: 'Resubmission not found.' });
    }

    res.status(200).json(resubmission);
  } catch (error) {
    console.error('Error in /findresubmissions:', error.message);
    res.status(500).json({ message: 'Server error. Failed to fetch resubmission.' });
  }
});
router.get('/findresubmissions', async (req, res) => {

  try {
    const userId = req.query.userId;
    const resubmissions = await Resubmission.find({ userId });

    const populatedResubmissions = await Promise.all(
      resubmissions.map(async (resubmission) => {
        const moreTimeRequested = await TimeRequest.exists({ resubmissionId: resubmission._id });
        return {
          ...resubmission.toObject(),
          moreTimeRequested: Boolean(moreTimeRequested),
        };
      })
    );

    res.status(200).json(populatedResubmissions);
  } catch (error) {
    console.error('Error fetching resubmissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/submissions/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const submission = await Submission.findById(id).populate('templateId');
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.get('/templates/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const template = await Template.findById(id);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
router.post('/request-time/:id', async (req, res) => {
  try {
    const { reason } = req.body;
    await Resubmission.findByIdAndUpdate(req.params.id, {
      isRequestMoreTime: true,
      reason,
    });
    res.json({ message: 'Time extension request submitted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.put('/updatestatus/:id', async (req, res) => {
  const { status } = req.body;
  try {
    const resubmission = await Resubmission.findById(req.params.id);
    if (!resubmission) {
      return res.status(404).json({ error: 'Resubmission not found' });
    }

    resubmission.status = status || resubmission.status;
    await resubmission.save();

    res.status(200).json({ message: 'Resubmission updated successfully' });
  } catch (error) {
    console.error('Error updating resubmission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/submitted/:id', async (req, res) => {
  try {
    const submitted = await Submission.findById(req.params.id);
    if (!submitted) {
      return res.status(404).json({ error: 'Submitted record not found' });
    }
    res.status(200).json(submitted);
  } catch (error) {
    console.error('Error fetching submitted record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/submitted/:id/template-questions', async (req, res) => {
  try {
    const submitted = await Submission.findById(req.params.id);
    if (!submitted) {
      return res.status(404).json({ error: 'Submitted record not found' });
    }

    const template = await Template.findById(submitted.templateId);
    if (!template) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.status(200).json(template.questions);
  } catch (error) {
    console.error('Error fetching template questions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/submitted/:id', async (req, res) => {
  const { staffId, resubmit } = req.body;
  try {
    const submitted = await Submission.findById(req.params.id);
    if (!submitted) {
      return res.status(404).json({ error: 'Submitted record not found' });
    }

    const hierarchyItem = submitted.hierarchy.find(item => item.staffId === staffId);
    if (!hierarchyItem) {
      return res.status(400).json({ error: 'Staff ID not found in hierarchy' });
    }

    hierarchyItem.pending = false;
    submitted.resubmit = false ;

    await submitted.save();

    res.status(200).json({ message: 'Submitted record updated successfully' });
  } catch (error) {
    console.error('Error updating submitted record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/submitted/:id/answers', async (req, res) => {
  const { questions } = req.body;
  try {
    const submitted = await Submission.findById(req.params.id);
    if (!submitted) {
      return res.status(404).json({ error: 'Submitted record not found' });
    }

    submitted.questions = questions || submitted.questions;
    await submitted.save();

    res.status(200).json({ message: 'Submitted answers updated successfully' });
  } catch (error) {
    console.error('Error updating submitted answers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/form/time-requests', async (req, res) => {
  const { resubmissionId, reason, requestingAdditionalTime } = req.body;

  const now = new Date();
  const oneWeekLater = new Date();
  oneWeekLater.setDate(now.getDate() + 7);

  if (new Date(requestingAdditionalTime) > oneWeekLater) {
    return res.status(400).json({ message: "Requesting additional time cannot exceed one week from today." });
  }

  try {
    const timeRequest = new TimeRequest({
      resubmissionId,
      reason,
      requestingAdditionalTime,
    });
    await timeRequest.save();
    res.status(201).json({ message: "Time request submitted successfully." });
  } catch (err) {
    res.status(500).json({ message: "Failed to submit the request.", error: err.message });
  }
});

router.get('/requests', async (req, res) => {
  try {
    const staffId = req.query.staffId;

    const resubmissions = await Resubmission.find({ staffId });

    const resubmissionIds = resubmissions.map((resubmission) => resubmission._id);

    const timeRequests = await TimeRequest.find({
      resubmissionId: { $in: resubmissionIds },
    }).populate('resubmissionId');

    res.status(200).json({ success: true, data: timeRequests });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


router.get('/view-request/:id', async (req, res) => {
  try {
    const requestId = req.params.id;

    const timeRequest = await TimeRequest.findById(requestId).populate('resubmissionId');
    if (!timeRequest) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    res.status(200).json({ success: true, data: timeRequest });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.delete('/delete-request/:id', async (req, res) => {
  try {
    const requestId = req.params.id;

    const timeRequest = await TimeRequest.findById(requestId);
    if (!timeRequest) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    await Resubmission.findByIdAndDelete(timeRequest.resubmissionId);
    await timeRequest.deleteOne();

    res.status(200).json({ success: true, message: 'Request and resubmission deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.put('/extend-deadline/:id', async (req, res) => {
  try {
    const requestId = req.params.id;
    const { newDeadline } = req.body;

    const timeRequest = await TimeRequest.findById(requestId);
    if (!timeRequest) {
      return res.status(404).json({ success: false, error: 'Request not found' });
    }

    const resubmission = await Resubmission.findById(timeRequest.resubmissionId);
    if (!resubmission) {
      return res.status(404).json({ success: false, error: 'Resubmission not found' });
    }

    resubmission.deadline = newDeadline;
    resubmission.isRequestMoreTime = false;
    await resubmission.save();

    await timeRequest.deleteOne(); 
    res.status(200).json({ success: true, message: 'Deadline extended successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Server error' });
  }
});



// Get resubmission details by ID
// Example backend route for fetching resubmission
router.get('/resubmit/:resubmissionId', async (req, res) => {
  try {
    const resubmission = await Resubmission.findById(req.params.resubmissionId).populate('submissionId');
    res.json(resubmission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/findsubmit/:submissionId', async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.submissionId);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    res.json(submission); // Return the submission data
  } catch (err) {
    res.status(500).json({ message: err.message }); // Handle errors
  }
});
// Example backend route for updating submission
router.put("/update/:submissionId/:resubmissionId", async (req, res) => {
  try {
    const { submissionId, resubmissionId } = req.params;
    const updatedSubmissionData = req.body;
    // Find the submission
    let submission = await Submission.findById(submissionId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    // Set resubmit state to false
    submission.resubmit = false;
    if (updatedSubmissionData.questions) {
      submission.questions = updatedSubmissionData.questions;
    }
    // Find the staff member in the hierarchy where `pending` is true
    const staffMember = submission.hierarchy.find((h) => h.pending === true);
    if (staffMember) {
      staffMember.pending = false;

      // Find the staff email from the Staff model
      const staff = await Staff.findOne({ staffId: staffMember.staffId });
      if (staff) {
        // Send email notification
        await sendEmail(
          staff.email,
          "Resubmission Successfully Updated",
          `The resubmission with ID ${resubmissionId} has been successfully processed.`
        );
      }
    }

    // Save the updated submission
    await submission.save();

    // Delete the resubmission using resubmissionId
    await Resubmission.findByIdAndDelete(resubmissionId);

    res.json({ message: "Submission updated and resubmission deleted successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Update submission answers
router.put("/updatesubmissions/:submissionId", async (req, res) => {
  try {
    const updatedSubmission = await Submission.findByIdAndUpdate(
      req.params.submissionId,
      req.body,
      { new: true }
    );

    if (!updatedSubmission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.json(updatedSubmission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


module.exports = router;
