const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Connect MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://olp2.up.railway.app',
    'https://adaptable-renewal.up.railway.app' // Frontend domain
  ],
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/student', require('./routes/student'));
app.use('/api/public', require('./routes/public'));

app.get('/', (req, res) => {
  res.send('Online Learning Platform API (Running on Railway)');
});

// Catch-all for non-API routes
app.get('*', (req, res) => {
  res.status(404).send('API route not found');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
