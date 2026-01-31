const express = require('express');
const { initiateEsewaPayment, verifyEsewaPayment, getUserBookings, resendBookingEmail } = require('../controllers/paymentController');

const router = express.Router();

router.post('/esewa/initiate', initiateEsewaPayment);
router.post('/esewa/verify', verifyEsewaPayment);
router.get('/bookings/:userId', getUserBookings);
router.post('/resend-email', resendBookingEmail);

module.exports = router;
