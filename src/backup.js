const request = require('request');
const dotenv = require('dotenv');

dotenv.config();

const PASSWORD = 'yourSecurePassword';

request.post({
    url: 'http://localhost:3000/backup',
    form: { password: PASSWORD }
}, (err, httpResponse, body) => {
    if (err) {
        return console.error('Backup failed:', err);
    }
    console.log('Backup response:', body);
});
