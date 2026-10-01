
const express = require('express');
const mongoose = require('mongoose');
const Booking = require('./booking-model');
const Court = require('./court-model');
const authMiddleware = require('./auth-middleware');

const router = express.Router();

// Create a booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { courtId, date, startTime, endTime } = req.body;

    // Validate required fields
    if (!courtId || !date || !startTime || !endTime) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    // Validate court ID
    if (!mongoose.isValidObjectId(courtId)) {
      return res.status(400).json({
        message: 'Invalid court ID'
      });
    }

    // Validate date and time format
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;
    const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

    if (
      typeof date !== 'string' ||
      typeof startTime !== 'string' ||
      typeof endTime !== 'string' ||
      !datePattern.test(date) ||
      !timePattern.test(startTime) ||
      !timePattern.test(endTime)
    ) {
      return res.status(400).json({
        message: 'Invalid date or time format'
      });
    }

    const start = new Date(`${date}T${startTime}:00+07:00`);
    const end = new Date(`${date}T${endTime}:00+07:00`);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(end.getTime()) ||
      start >= end ||
      start <= new Date()
    ) {
      return res.status(400).json({
        message: 'Please select a valid future time'
      });
    }

    // Check whether the court exists
    const court = await Court.findById(courtId);

    if (!court || court.status !== 'active') {
      return res.status(400).json({
        message: 'Court is unavailable'
      });
    }

    // Prevent overlapping bookings
    const existingBooking = await Booking.findOne({
      court: courtId,
      date,
      status: 'confirmed',
      startTime: { $lt: endTime },
      endTime: { $gt: startTime }
    });

    if (existingBooking) {
      return res.status(409).json({
        message: 'This court is already booked at that time'
      });
    }

    // Save booking
    const booking = await Booking.create({
      user: req.userId,
      court: courtId,
      date,
      startTime,
      endTime
    });

    res.status(201).json({
      message: 'Booking successful',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);

    res.status(500).json({
      message: 'Server error'
    });
  }
});

 // Cancel my booking
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid booking ID'
      });
    }

    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.userId
    });

    if (!booking) {
      return res.status(404).json({
        message: 'Booking not found'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        message: 'Booking is already cancelled'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);

    res.status(500).json({
      message: 'Server error'
    });
  }
});
module.exports = router;

 // Get my bookings
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.userId
    })
      .populate('court', 'name pricePerHour')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Get my bookings error:', error);

    res.status(500).json({
      message: 'Server error'
    });
  }
});