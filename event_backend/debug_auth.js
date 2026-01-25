require('dotenv').config();
try {
    console.log('Attempting to require authController...');
    const auth = require('./src/controllers/authController');
    console.log('Successfully required authController');
} catch (err) {
    console.error('Failed to require authController:', err);
    console.error(err.stack);
}
