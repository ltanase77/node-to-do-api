const crypto = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

let password = "zamoldegikos234";
/* bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
}); */

let hashedPassword = '$2a$10$OogDCb4lt0LSmuve2S51fey.xP8nxgM/T1h836CSjGLpDp9E6UKs2';

bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log(result);
});

/* const data = {
    id: 10,
};

const token = jwt.sign(data, '123abc');
console.log(token);
const decoded = jwt.verify(token, '123abc');
console.log('decoded:', decoded); */
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
