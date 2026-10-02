const express = require('express');

const authMiddleware = require('../middleware/auth-middleware');

const {
  createBooking,
  cancelBooking,
  getMyBookings
} = require('../controllers/booking-controller');

const router = express.Router();

// Create a booking
router.post('/', authMiddleware, createBooking);

// Get my bookings
router.get('/my', authMiddleware, getMyBookings);

// Cancel my booking
router.patch('/:id/cancel', authMiddleware, cancelBooking);

module.exports = router;