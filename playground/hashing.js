const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');

const data = {
    id: 10,
};

const token = jwt.sign(data, '123abc');
console.log(token);
const decoded = jwt.verify(token, '123abc');
console.log('decoded:', decoded);
/* const message = 'I am user number three';
const hash = crypto.SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hashing: ${hash}`);

const data = {
    id: 4,
};
const token = {
    data,
    hash: crypto.SHA256(JSON.stringify(data) + 'somesecret').toString(),
};

// token.data.id = 5;
// token.hash = crypto.SHA256(JSON.stringify(token.data)).toString();

const resultHash = crypto.SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if (resultHash === token.hash) {
    console.log('Data was not change');
} else {
    console.log('Data was changed. Do not trust!');
} */
