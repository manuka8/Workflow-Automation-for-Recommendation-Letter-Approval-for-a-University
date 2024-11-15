require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to the database
connectDB();

// Middleware and Routes
app.use(express.json());

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
