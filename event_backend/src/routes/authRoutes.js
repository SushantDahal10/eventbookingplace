const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/verify-otp', authController.verifyOtp);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/resend-otp', authController.resendOtp);
router.get('/me', authController.getMe);
router.put('/profile', authController.updateProfile);
router.post('/profile/request-email-change', authController.requestEmailUpdate);
router.put('/profile/verify-email-change', authController.verifyEmailUpdate);

module.exports = router;
