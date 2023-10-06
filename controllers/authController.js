const User = require("../models/user");
const OTP = require("../models/otp");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const twilio = require('twilio');

// Create a Nodemailer transporter
// const transporter = nodemailer.createTransport({
//   service: 'Gmail',
//   auth: {
//     user: 'itishreepanda.1998@gmail.com',
//     pass: 'princeprincy',
//   },
// });
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email',
  port: 587,
  auth: {
      user: 'camille.doyle@ethereal.email',
      pass: 'Qh3gqpVZqR5nvQX1TE'
  }
});


//RX52TCS8VSCDFBNUQK9ZQJ12 ---TWILIO RECOVERY CODE store in safe place

// Create a Twilio client
// const client = twilio('your-account-sid', 'your-auth-token');
const client = twilio('AC5426ce1735418c45d2f73064d92bd8ca', '9b87cbd54e52fe476e4c7c5a2f9b5a98');


//otp signup
const signup = async (req, res) =>{
  try {
    const {username, email, mobile, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { mobile }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTPs for email and mobile
    const otp = Math.floor(1000 + Math.random() * 9000).toString(); // Generate a 4-digit OTP

    // Save the user to the database
    const user = new User({ username,email, mobile, password: hashedPassword });
    await user.save();

    // Save the OTP to the database
    const otpEntry = new OTP({ email, mobile, otp });
    await otpEntry.save();

    // Send OTPs to email and mobile
    sendEmailOTP(email, otp);
    sendMobileOTP(mobile, otp);

    res.status(201).json({ message: 'User registered successfully. OTPs sent.' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Registration failed.' });
  }
}



// Function to send OTP to email
function sendEmailOTP(email, otp) {
  const mailOptions = {
    from: 'camille.doyle@ethereal.email',
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}


// Function to send OTP to mobile
function sendMobileOTP(mobile, otp) {
  client.messages
    .create({
      body: `Your OTP code is: ${otp}`,
      from: '+12565983295',
      to: mobile,
    })
    .then((message) => {
      console.log('SMS sent:', message.sid);
    })
    .catch((error) => {
      console.error('Error sending SMS:', error);
    });
}


// Signup logic
// const signup = async (req, res) => {
//   console.log("signup",req.body);
//   try {
//     const { username, email, password } = req.body;

//     // Check if the username already exists
//     const existingUser = await User.findOne({ username });
//     // username:username

//     if (existingUser) {
//       return res.status(400).json({ error: "Username already exists" });
//     }

//     const existingemail = await User.findOne({ email });

//     if (existingemail) {
//       return res.status(400).json({ error: "email already exists" });
//     }
//     // Hash the password
//     const saltRounds = 10;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Create a new user
//     const newUser = new User({
//       username: username,
//       email: email,
//       password: hashedPassword,
//     });
//     await newUser.save();

//     // const todo = new Todo(req.body);
//     // await todo.save();

//     // // Create a JWT token
//     // const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
//     //   expiresIn: "1h", // Token expires in 1 hour (adjust as needed)
//     // });

//     // res.status(201).json({ token });
//     res.status(201).json({ message: "the user save successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };


// User login route
const login = async (req, res) =>  {
  try {
    const { email, mobile, password, otp } = req.body;

    // Check if the user exists
    const user = await User.findOne({ $or: [{ email }, { mobile }] });
    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    // Verify the provided credentials (password or OTP)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    const isOtpValid = await OTP.findOne({ email, mobile, otp });

    if (!(isPasswordValid || isOtpValid)) {
      return res.status(401).json({ message: 'Invalid credentials or OTP.' });
    }

    // Generate a JWT token on successful login
    // const token = generateToken(user);

    // res.status(200).json({ token });
    res.status(200).json({ login:"success" });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Login failed.' });
  }
};

// Generate JWT token (as described in previous responses)



// const login = async (req, res) => {
//   try {
//     const { mailuserId, password } = req.body;
//     console.log("mailuserId", mailuserId, "password", password);
//     const user = await User.find({
//       $or: [
//         { username: { $regex: mailuserId, $options: "i" } },
//         { email: { $regex: mailuserId, $options: "i" } },
//       ],
//     });
//     console.log(user);

//     if (!user) {
//       return res.status(403).json({ message: "Invalid Credentials" });
//     }
//     console.log("rakesh1", password, user.password);
//     const matchedPassword = await bcrypt.compare(password, user[0].password);
//     console.log("rakesh2");

//     console.log("matchedPassword", matchedPassword);
//     if (!matchedPassword) {
//       return res.status(401).json({ error: "Invalid credential" });
//     }
//     const token = jwt.sign({ userId: user[0]._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h", // Token expires in 1 hour (adjust as needed)
//     });

//     res.status(200).json({ token });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

module.exports = { signup, login };
