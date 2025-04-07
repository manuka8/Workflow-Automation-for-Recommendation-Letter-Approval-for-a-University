const express = require('express');
const mongoose = require('mongoose');
const path = require("path");
const fs = require("fs"); 

const studentRoutes = require('./routes/studentroutes');
const templateRoutes = require('./routes/templateRoutes');
const submissionsRoutes = require('./routes/submitRoutes');
const staffRoutes = require('./routes/staffroutes');
const pendingapprovalRoutes = require('./routes/PendingApprovalsRoutes');
const resubmissionRoutes = require('./routes/resubmissionRoute');
const rejectRoute = require('./routes/rejectRoute');
const profileRoutes = require('./routes/profileRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const uploadsDir = "uploads";
const filesDir = "uploads/files";

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir); 
}

const connectDB = require('./config/db');
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

app.use('/api/staff', staffRoutes);
app.use('/api/reject', rejectRoute);
app.use('/api/student', studentRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/resubmissions', resubmissionRoutes);
app.use('/api/pending-approvals', pendingapprovalRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));