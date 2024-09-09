const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// @desc    Register new user
// @route   POST /api/register
// @access  Public
// const registerUser = asyncHandler(async (req, res) => {
//   const { firstName, lastName, email, password, mobileNo } = req.body;

//   // Validate input
//   if (!email || !password || !firstName || !lastName) {
//     res.status(400).json({ error: "Please add all fields" });
//     return;
//   }

//   // Validate email format
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     res.status(400).json({ error: "Email invalid" });
//     return;
//   }

//   // Validate mobile number
//   const mobileRegex = /^[0-9]{10}$/;
//   if (mobileNo && !mobileRegex.test(mobileNo)) {
//     res.status(400).json({ error: "Mobile number invalid" });
//     return;
//   }

//   // Validate password length
//   if (password.length < 8) {
//     res.status(400).json({ error: "Password must be atleast 8 characters" });
//     return;
//   }

//   // Check if user exists
//   const userExists = await User.findOne({ email });

//   if (userExists) {
//     res.status(400).json({ error: "User already exists" });
//     return;
//   }

//   // Hash password
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);

//   // Create user
//   const user = await User.create({
//     firstName,
//     lastName,
//     email,
//     password: hashedPassword,
//     mobileNo,
//   });

//   if (user) {
//     res.status(201).json({ message: "Registered Successfully" });
//   } else {
//     res.status(400).json({ error: "Invalid user data" });
//   }
// });

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, mobileNo } = req.body;

  if (!email || !password || !firstName || !lastName) {
    return res.status(400).json({ error: "Please add all fields" });
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(400).json({ error: "User already exists" });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    mobileNo,
  });

  if (user) {
    // Sending confirmation email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Registration Successful',
      text: `Welcome ${firstName}! Your registration is successful.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ message: 'Error sending email', error });
      }
      res.status(201).json({ message: "Registered successfully and email sent" });
    });
  } else {
    res.status(400).json({ error: "Invalid user data" });
  }
});

// @desc    Authenticate a user
// @route   POST /api/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400).json({ error: "Please add all fields" });
    return;
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ error: "Invalid Email" });
    return;
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.json({
      access: token,
    });
  } else if (!user) {
    res.status(404).json({ error: "No Email Found" });
  } else {
    res.status(401).json({ error: "Email and password do not match" });
  }
});

// @desc    Get user profile
// @route   GET /api/details
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        isAdmin: user.isAdmin,
        mobileNo: user.mobileNo,
      },
    });
  } else {
    res.status(404).json({ error: "User not found" });
  }
});

// @desc    Update user to admin
// @route   PATCH /api/:id/set-as-admin
// @access  Private/Admin
const updateUserAsAdmin = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      res.status(404).json({ error: "User not Found" });
      return;
    }

    user.isAdmin = true;
    const updatedUser = await user.save();

    res.status(200).json({
      updatedUser: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        password: updatedUser.password, // Normally you would not include the password in the response
        isAdmin: updatedUser.isAdmin,
        mobileNo: updatedUser.mobileNo,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed in Find",
      details: error,
    });
  }
});

// @desc    Update user password
// @route   PATCH /api/update-password
// @access  Private
// const updateUserPassword = asyncHandler(async (req, res) => {
//   const { oldPassword, newPassword } = req.body;

//   // Validate input
//   if (!oldPassword || !newPassword) {
//     res.status(400).json({ error: "Please add all fields" });
//     return;
//   }

//   const user = await User.findById(req.user._id);

//   if (!user) {
//     res.status(404).json({ error: "User not found" });
//     return;
//   }

//   const isMatch = await bcrypt.compare(oldPassword, user.password);

//   if (!isMatch) {
//     res.status(400).json({ error: "Old password is incorrect" });
//     return;
//   }

//   // Hash new password
//   const salt = await bcrypt.genSalt(10);
//   user.password = await bcrypt.hash(newPassword, salt);

//   await user.save();

//   res.status(201).json({ message: "Password reset successfully" });
// });
const updateUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: "Please add all fields" });
  }

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  const isMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isMatch) {
    return res.status(400).json({ error: "Old password is incorrect" });
  }

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  await user.save();

  // Sending confirmation email
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Updated",
    text: "Your password has been successfully updated.",
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).json({ message: "Error sending email", error });
    }
    res
      .status(201)
      .json({ message: "Password reset successfully and email sent" });
  });
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserAsAdmin,
  updateUserPassword,
};
