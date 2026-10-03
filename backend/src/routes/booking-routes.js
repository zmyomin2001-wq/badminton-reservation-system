const express = require('express');

const authMiddleware = require('../middleware/auth-middleware');

const {
  createBooking,
  updateBooking,
  cancelBooking,
  deleteBooking,
  getMyBookings
} = require('../controllers/booking-controller');

const router = express.Router();

// Create a booking
router.post('/', authMiddleware, createBooking);

// Get my bookings
router.get('/my', authMiddleware, getMyBookings);

// Update my booking
router.put('/:id', authMiddleware, updateBooking);

// Cancel my booking
router.patch('/:id/cancel', authMiddleware, cancelBooking);

// Delete my booking
router.delete('/:id', authMiddleware, deleteBooking);

module.exports = router;