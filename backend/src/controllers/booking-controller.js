const mongoose = require('mongoose');

const Booking = require('../models/booking-model');
const Court = require('../models/court-model');

// Create a booking
// Delete my booking
async function deleteBooking(req, res) {
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

    await Booking.deleteOne({
      _id: req.params.id
    });

    res.status(200).json({
      message: 'Booking deleted successfully'
    });
  } catch (error) {
    console.error('Delete booking error:', error);

    res.status(500).json({
      message: 'Server error'
    });
  }
}
async function createBooking(req, res) {
  try {
    const { courtId, date, startTime, endTime } = req.body;

    if (!courtId || !date || !startTime || !endTime) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    if (!mongoose.isValidObjectId(courtId)) {
      return res.status(400).json({
        message: 'Invalid court ID'
      });
    }

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

    const court = await Court.findById(courtId);

    if (!court || court.status !== 'active') {
      return res.status(400).json({
        message: 'Court is unavailable'
      });
    }

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
}

// Cancel my booking
// Update my booking
async function updateBooking(req, res) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid booking ID'
      });
    }

    const { courtId, date, startTime, endTime } = req.body;

    if (!courtId || !date || !startTime || !endTime) {
      return res.status(400).json({
        message: 'All fields are required'
      });
    }

    if (!mongoose.isValidObjectId(courtId)) {
      return res.status(400).json({
        message: 'Invalid court ID'
      });
    }

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
        message: 'Cannot update a cancelled booking'
      });
    }

    const court = await Court.findById(courtId);

    if (!court || court.status !== 'active') {
      return res.status(400).json({
        message: 'Court is unavailable'
      });
    }

    const existingBooking = await Booking.findOne({
      _id: { $ne: req.params.id },
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

    booking.court = courtId;
    booking.date = date;
    booking.startTime = startTime;
    booking.endTime = endTime;

    await booking.save();

    res.status(200).json({
      message: 'Booking updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);

    res.status(500).json({
      message: 'Server error'
    });
  }
}
async function cancelBooking(req, res) {
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
}

// Get my bookings
async function getMyBookings(req, res) {
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
}

module.exports = {
  createBooking,
  updateBooking,
  cancelBooking,
  deleteBooking,
  getMyBookings
};