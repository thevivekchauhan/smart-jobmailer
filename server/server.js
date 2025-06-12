// server/server.js
require('dotenv').config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('ERROR: Missing required environment variables:', missingVars.join(', '));
  console.error('Please check your .env file');
  process.exit(1);
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

// Log environment status
console.log('Environment:', process.env.NODE_ENV || 'development');

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Routes
const emailRoutes = require('./routes/emailRoutes');
const authRoutes = require('./routes/authRoutes');

app.use('/api', emailRoutes);
app.use('/api/auth', authRoutes);

// DB Connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
