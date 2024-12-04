const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');

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

// routes
app.use('/', require('./routes/pages'))
app.use('/show-city', require('./routes/show-city'));

// Server starts listening
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});