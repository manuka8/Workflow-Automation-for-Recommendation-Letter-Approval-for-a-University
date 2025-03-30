const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const router = express.Router();
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/sendEmail"); // Helper function for email
router.post("/login", async (req, res) => {
  try {
    const { studentId, password } = req.body;

    const student = await Student.findOne({ studentId });
    if (!student) {
      return res.status(404).json({ message: "Student ID not found" });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const student = await Student.findOne({ studentId: req.params.id });
    if (!student) {
      return res.status(404).send("Student not found");
    }
    res.json(student);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

router.get("/findstudentsds", async (req, res) => {
  try {
    const students = await Student.find();

    if (students.length === 0) {
      return res.status(404).json({ message: "No students found" });
    }

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Server Error: Unable to fetch students" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { studentId, firstName, lastName, email, faculty, department } =
      req.body;

    // Check if student already exists
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({ message: "Student already registered" });
    }

    // Generate a random password
    const autoGeneratedPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(autoGeneratedPassword, 10);

    // Create and save student
    const student = new Student({
      studentId,
      firstName,
      lastName,
      email,
      faculty,
      department,
      password: hashedPassword,
    });

    await student.save();

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mmyuth2020@gmail.com", // Replace with actual email
        pass: "hhbw jyhv pjwl ynve", // Use an App Password
      },
    });

    const mailOptions = {
      from: "mmyuth2020@gmail.com",
      to: email,
      subject: "Student Registration Successful - Login Details",
      html: `
        <p>Dear ${firstName},</p>
        <p>Your student account has been successfully registered. Below are your login details:</p>
        <ul>
          <li><strong>Student ID:</strong> ${studentId}</li>
          <li><strong>Password:</strong> ${autoGeneratedPassword}</li>
        </ul>
        <p>Please change your password after logging in.</p>
        <p>Best regards,<br/>Admin Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message:
        "Student successfully registered and verification email sent to student email.",
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Update student details
router.put("/:id", async (req, res) => {
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { studentId: req.params.id },
      { $set: req.body },
      { new: true }
    );
    if (!updatedStudent)
      return res.status(404).json({ message: "Student not found" });

    res.json({
      message: "Student updated successfully",
      student: updatedStudent,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete student
router.delete("/:id", async (req, res) => {
  try {
    const deletedStudent = await Student.findOneAndDelete({
      studentId: req.params.id,
    });
    if (!deletedStudent)
      return res.status(404).json({ message: "Student not found" });

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post('/bulk-register', async (req, res) => {
  const { students } = req.body;

  try {
    const savedStudents = await Promise.all(
      students.map(async (studentData) => {
        const { studentId, email } = studentData;

        
        const existingStudentById = await Student.findOne({ studentId });
        if (existingStudentById) {
          throw new Error(`Student ID ${studentId} is already registered.`);
        }

        
        const existingStudentByEmail = await Student.findOne({ email });
        if (existingStudentByEmail) {
          throw new Error(`Email ${email} is already registered.`);
        }

        
        const password = Math.random().toString(36).slice(-8);

        
        const saltRounds = 10; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const student = new Student({
          studentId,
          firstName: studentData.firstName,
          lastName: studentData.lastName,
          email,
          faculty: studentData.faculty,
          department: studentData.department,
          course: studentData.course,
          password: hashedPassword, 
          profilePicture: '',
        });

        const savedStudent = await student.save();

        if (studentData.sendEmail) {
          const message = `Your student ID is ${savedStudent.studentId} and your password is ${password}.`;
          await sendEmail(savedStudent.email, 'Student Registration', message);
        }

        console.log(`Student ID: ${savedStudent.studentId}, Password: ${password}`);

        return savedStudent;
      })
    );

    res.status(201).json(savedStudents);
  } catch (error) {
    console.error('Error during bulk registration:', error);
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
