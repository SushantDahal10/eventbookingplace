require('dotenv').config();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_KEY;

console.log('--- DEBUG ENV START ---');
console.log(`SUPABASE_URL raw: '${url}'`);
console.log(`SUPABASE_URL type: ${typeof url}`);
console.log(`SUPABASE_URL length: ${url ? url.length : 'N/A'}`);
if (url) {
    console.log(`First char code: ${url.charCodeAt(0)}`);
    console.log(`Last char code: ${url.charCodeAt(url.length - 1)}`);
}
console.log(`SUPABASE_KEY loaded: ${!!key}`);
console.log('--- DEBUG ENV END ---');
