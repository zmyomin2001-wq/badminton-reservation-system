require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDatabase = require('./src/config/database');

const authRoutes = require('./src/routes/auth-routes');
const courtRoutes = require('./src/routes/court-routes');
const bookingRoutes = require('./src/routes/booking-routes');

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

// Start server
async function startServer() {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Backend server running at http://localhost:${PORT}`);
  });
}

startServer();