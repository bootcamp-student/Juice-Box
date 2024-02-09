const crypto = require('crypto');

// Generate a random secret key with 32 bytes (256 bits) length
const secretKey = crypto.randomBytes(32).toString('hex');

console.log('New Secret Key:', secretKey);

// Export the secret key for use in other modules if needed
module.exports = secretKey;
