const mongoose = require('mongoose');

const Court = require('../models/court-model');

// Get all courts
async function getCourts(req, res) {
  try {
    const courts = await Court.find().sort({ name: 1 });

    res.status(200).json(courts);
  } catch (error) {
    console.error('Get courts error:', error);

    res.status(500).json({
      message: 'Server error'
    });
  }
}

// Create a new court
async function createCourt(req, res) {
  try {
    const { name, pricePerHour, status } = req.body;

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof pricePerHour !== 'number' ||
      !Number.isFinite(pricePerHour) ||
      pricePerHour < 0
    ) {
      return res.status(400).json({
        message: 'Valid court name and price are required'
      });
    }

    const court = await Court.create({
      name: name.trim(),
      pricePerHour,
      status: status || 'active'
    });

    res.status(201).json(court);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Court name already exists'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message
      });
    }

    console.error('Create court error:', error);

    res.status(500).json({
      message: 'Server error'
    });
  }
}

// Update a court
async function updateCourt(req, res) {
  try {
    const { id } = req.params;
    const { name, pricePerHour, status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid court ID'
      });
    }

    if (
      typeof name !== 'string' ||
      !name.trim() ||
      typeof pricePerHour !== 'number' ||
      !Number.isFinite(pricePerHour) ||
      pricePerHour < 0
    ) {
      return res.status(400).json({
        message: 'Valid court name and price are required'
      });
    }

    if (
      status !== undefined &&
      !['active', 'maintenance'].includes(status)
    ) {
      return res.status(400).json({
        message: 'Invalid court status'
      });
    }

    const court = await Court.findByIdAndUpdate(
      id,
      {
        name: name.trim(),
        pricePerHour,
        status: status || 'active'
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!court) {
      return res.status(404).json({
        message: 'Court not found'
      });
    }

    res.status(200).json(court);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Court name already exists'
      });
    }

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: error.message
      });
    }

    console.error('Update court error:', error);

    res.status(500).json({
      message: 'Server error'
    });
  }
}

// Delete a court
async function deleteCourt(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        message: 'Invalid court ID'
      });
    }

    const court = await Court.findByIdAndDelete(id);

    if (!court) {
      return res.status(404).json({
        message: 'Court not found'
      });
    }

    res.status(200).json({
      message: 'Court deleted successfully'
    });
  } catch (error) {
    console.error('Delete court error:', error);

    res.status(500).json({
      message: 'Server error'
    });
  }
}

module.exports = {
  getCourts,
  createCourt,
  updateCourt,
  deleteCourt
};