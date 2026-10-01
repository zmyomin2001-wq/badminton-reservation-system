
const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    pricePerHour: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ['active', 'maintenance'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Court', courtSchema);