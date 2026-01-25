require('dotenv').config();
try {
    console.log('Attempting to require app.js...');
    const app = require('./src/app');
    console.log('Successfully required app.js');
} catch (err) {
    console.error('Failed to require app.js:', err);
    console.error(err.stack);
}
