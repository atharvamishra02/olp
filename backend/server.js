// server.js or api/index.js
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const serverless = require('serverless-http');
const path = require('path');

// Create Express app
const app = express();

// CORS
app.use(cors({
  origin: ['http://localhost:5173', 'https://olp2.vercel.app'],
  credentials: true,
}));

// JSON Parser
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/student', require('./routes/student'));
app.use('/api/public', require('./routes/public'));

app.get('/', (req, res) => {
  res.send('Online Learning Platform API (Serverless)');
});

// Lazy MongoDB connect on cold start
let dbConnected = false;
app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (err) {
      console.error('❌ MongoDB connection failed:', err);
      return res.status(500).send('MongoDB connection error');
    }
  }
  next();
});

// ✅ EXPORT the serverless handler
module.exports = serverless(app);
