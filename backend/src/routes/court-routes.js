const express = require('express');

const authMiddleware = require('../middleware/auth-middleware');
const adminMiddleware = require('../middleware/admin-middleware');

const {
  getCourts,
  createCourt,
  updateCourt,
  deleteCourt
} = require('../controllers/court-controller');

const router = express.Router();

// Get all courts
router.get('/', getCourts);

// Create a new court
router.post('/', authMiddleware, adminMiddleware, createCourt);

// Update a court
router.put('/:id', authMiddleware, adminMiddleware, updateCourt);

// Delete a court
router.delete('/:id', authMiddleware, adminMiddleware, deleteCourt);

module.exports = router;