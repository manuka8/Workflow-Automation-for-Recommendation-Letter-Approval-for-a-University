const express = require('express');
const mongoose = require('mongoose');
//const studentRoute = require('./routes/studentRoute')
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Connect to the database
const connectDB = require('./config/db');
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json())

//app.use('/login/student', studentRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
