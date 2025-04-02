const express = require('express');
const mongoose = require('mongoose');
//const studentRoute = require('./routes/studentRoute')
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const studentRoutes = require('./routes/studentroutes');
const templateRoutes = require('./routes/templateRoutes');
const submissionsRoutes = require('./routes/submitRoutes');
const staffRoutes = require('./routes/staffroutes');
const pendingapprovalRoutes = require('./routes/PendingApprovalsRoutes');
const connectDB = require('./config/db');
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json())

app.use('/api/staff', staffRoutes);
app.use('/api/submissions', submissionsRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/pending-approvals', pendingapprovalRoutes);
app.use('/api/templates', templateRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
