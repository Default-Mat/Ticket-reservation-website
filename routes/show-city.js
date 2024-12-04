const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

//Database connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

router.post('/show-city', (req, res) => {
    const partial_city_name = req.body;
    const like_value = `%${partial_city_name}%`;
    const select_city_query = 'SELECT * FROM train-db WHERE city_name LIKE ?';
    db.query(select_city_query, [like_value], (select_error, select_results) =>{
        if (select_error)
            console.log(select_error);
        res.send(select_results)
    });
});

module.exports = router;