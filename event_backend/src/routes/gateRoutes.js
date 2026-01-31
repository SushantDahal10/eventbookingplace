const express = require('express');
const router = express.Router();
const gateController = require('../controllers/gateController');

// Auth
router.post('/signup', gateController.signup);
router.post('/login', gateController.login);

// Token Validation
router.post('/validate', gateController.validateToken);

// Token Consumption
router.post('/consume', gateController.consumeToken);

// Assigned Events for a staff member
router.get('/events/:userId', gateController.getAssignedEvents);

// Entry History for an event
router.get('/history/:eventId', gateController.getEntryHistory);

module.exports = router;
