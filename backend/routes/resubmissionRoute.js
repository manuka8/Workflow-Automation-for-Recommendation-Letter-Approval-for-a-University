const express = require('express');
const Submission = require('../models/Submitted');
const router = express.Router();

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
  
      await resubmission.save();
  
      res.status(200).json({ message: 'Resubmission saved successfully.' });
    } catch (error) {
      console.error('Error processing resubmission:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  });

  module.exports = router;