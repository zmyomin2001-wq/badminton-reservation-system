

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./auth-routes');
const courtRoutes = require('./court-routes');
const bookingRoutes = require('./booking-routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/bookings', bookingRoutes);

// Test API
app.get('/api', (req, res) => {
  res.json({
    message: 'Badminton Reservation API is running'
  });
});

// Connect to MongoDB before starting the server
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Database:', mongoose.connection.name);
    console.log('Database host:', mongoose.connection.host);
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Backend server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();