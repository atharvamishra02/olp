const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const app = express();
const PORT = process.env.PORT || 5000;
const path = require('path');

app.use(cors({
  origin: ['https://olp1.vercel.app', 'http://localhost:5000'],
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Placeholder routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/student', require('./routes/student'));
app.use('/api/public', require('./routes/public'));

app.get('/', (req, res) => {
  res.send('Online Learning Platform API');
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}); 