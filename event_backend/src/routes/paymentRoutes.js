const express = require('express');
const { initiateEsewaPayment, verifyEsewaPayment, getUserBookings } = require('../controllers/paymentController');

const router = express.Router();

router.post('/esewa/initiate', initiateEsewaPayment);
router.post('/esewa/verify', verifyEsewaPayment);
router.get('/bookings/:userId', getUserBookings);

module.exports = router;
