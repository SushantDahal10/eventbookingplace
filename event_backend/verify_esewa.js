const crypto = require('crypto');

const secret_key = '8gBm/:&EnhH.1/q';
const total_amount = '100';
const transaction_uuid = '11-201-13';
const product_code = 'EPAYTEST';

// Hypothesis 2: String includes "key=value"
const signatureString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

console.log('--- Verification Test ---');
console.log(`Input: ${signatureString}`);
console.log(`Key: ${secret_key}`);

const hash = crypto.createHmac('sha256', secret_key)
    .update(signatureString)
    .digest('base64');

console.log(`Generated: ${hash}`);

const expected = '4Ov7pCI1zIOdwtV2BRMUNjz1upIlT/COTxfLhWvVurE=';
console.log(`Expected:  ${expected}`);
console.log(`Match:     ${hash === expected}`);
console.log('-------------------------');
