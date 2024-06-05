const express = require('express');
const mysql = require('mysql');
const dotenv = require('dotenv');
const { exec } = require('child_process');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');

// Load environment variables from .env file
dotenv.config();

const app = express();
const port = 3000;

// Set up body parser to handle POST requests
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to database');
});

// Define the password
const PASSWORD = '1234';

app.get('/', (req, res) => {
    res.send('Book Management API');
});

// Serve the restore form
app.get('/restore', (req, res) => {
    res.sendFile(path.join(__dirname, 'restore.html'));
});

// Serve the backup form
app.get('/backup', (req, res) => {
    res.sendFile(path.join(__dirname, 'backup.html'));
});

// Set up Multer for file uploads
const upload = multer({ dest: 'uploads/' });

app.post('/restore', upload.single('backupFile'), (req, res) => {
    const { password } = req.body;
    if (password !== PASSWORD) {
        return res.status(401).send('Unauthorized: Incorrect password');
    }

    const backupFile = req.file.path;
    const command = `mysql -u${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} < ${backupFile}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error restoring backup: ${stderr}`);
            return res.status(500).send('Error restoring backup');
        }
        res.send('Backup restored successfully');
    });
});

app.post('/backup', (req, res) => {
    const { password } = req.body;
    if (password !== PASSWORD) {
        return res.status(401).send('Unauthorized: Incorrect password');
    }

    const backupFile = path.join(__dirname, 'backups', `${Date.now()}.sql`);
    const command = `mysqldump -u${process.env.DB_USER} -p${process.env.DB_PASSWORD} ${process.env.DB_NAME} > ${backupFile}`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error creating backup: ${stderr}`);
            return res.status(500).send('Error creating backup');
        }
        res.send('Backup created successfully');
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
