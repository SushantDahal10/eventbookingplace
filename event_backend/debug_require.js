require('dotenv').config();
try {
    console.log('Attempting to require paymentController...');
    const payment = require('./src/controllers/paymentController');
    console.log('Successfully required paymentController');
} catch (err) {
    console.error('Failed to require paymentController:', err);
}
