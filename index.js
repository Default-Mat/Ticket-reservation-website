const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cookie_parser = require('cookie-parser');
const session = require('express-session');

// .env file config
dotenv.config({path: './process.env'});

// database connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});
db.connect((error) => {
    if(error) {
        console.log(error)
    }
    else {
        console.log('Connected to MYSQL database.')
    }
});

// express app configs
const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'hbs');
app.use(cookie_parser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// routes
app.use('/', require('./routes/pages'))
app.use('/ajax', require('./routes/show-city'));
app.use('/auth', require('./routes/auth'));
app.use('/search-tickets', require('./routes/search-tickets'));
app.use('/submit-passengers', require('./routes/submit-passengers'));

// Server starts listening
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});