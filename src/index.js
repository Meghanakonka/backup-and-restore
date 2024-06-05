const express = require('express');
const path = require('path');
const mysql = require('mysql');
const dotenv = require('dotenv');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const LocalStrategy = require('passport-local').Strategy;

dotenv.config();

const app = express();
const port = 3000;

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Initialize session and flash
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));
app.use(flash());

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Define local strategy for Passport
passport.use(new LocalStrategy(
    function(username, password, done) {
        db.query('SELECT * FROM employees WHERE username = ?', [username], (err, results) => {
            if (err) {
                return done(err);
            }
            if (!results.length) {
                return done(null, false, { message: 'Incorrect username.' });
            }
            const user = results[0];
            if (user.password !== password) {
                return done(null, false, { message: 'Incorrect password.' });
            }
            return done(null, user);
        });
    }
));

// Serialize and deserialize user
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM employees WHERE id = ?', [id], (err, results) => {
        if (err) {
            return done(err);
        }
        const user = results[0];
        done(null, user);
    });
});

// Middleware to ensure user is authenticated
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
};

// Handle login POST request
app.post('/login', passport.authenticate('local', {
    successRedirect: '/backup',
    failureRedirect: '/restore',
    failureFlash: true
}));

// Serve the login form
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Serve the restore form
app.get('/restore', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'restore.html'));
});

// Serve the backup form
app.get('/backup', ensureAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'backup.html'));
});

// Redirect to the appropriate page after successful login
app.get('/', ensureAuthenticated, (req, res) => {
//     if (req.user.role === 'senior_manager' || req.user.role === 'manager') {
//         console.log(req.user.role);
//         res.redirect('/backup');
//     } 
//     if (req.user.role === 'contractor' || req.user.role === 'developer') {
//         console.log(req.user.role);
//         res.redirect('/restore');
        
//     } else {
//         console.log(req.user.role);
//     }
// });

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
