const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Validate JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.error('FATAL ERROR: JWT_SECRET is not defined.');
  process.exit(1);
}

// Generate JWT Token
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not configured');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!email || !password || !firstName) {
      return res.status(400).json({ 
        success: false,
        message: 'Please provide email, password, and first name' 
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    // Create new user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName ? lastName.trim() : '',
      email: email.toLowerCase().trim(),
      password
    });

    if (!user) {
      throw new Error('Failed to create user');
    }

    // Generate JWT token
    const token = generateToken(user._id);
    
    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Return user data (without password)
    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);

    // Validate input
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
        field: !email ? 'email' : 'password'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Login failed: Invalid email format');
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address',
        field: 'email'
      });
    }

    // Find user by email with password field included
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('Login failed: User not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        field: 'email'
      });
    }

    console.log('Comparing password...');
    let isMatch;
    try {
      isMatch = await user.matchPassword(password);
      console.log('Password match:', isMatch);
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw new Error('Error during password comparison');
    }

    if (!isMatch) {
      console.log('Login failed: Invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
        field: 'password'
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);
    
    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });

    // Return user data (without password)
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.firstName = req.body.firstName || user.firstName;
      user.lastName = req.body.lastName || user.lastName;
      user.email = req.body.email || user.email;
      
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
exports.logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({ message: 'Logged out successfully' });
};
