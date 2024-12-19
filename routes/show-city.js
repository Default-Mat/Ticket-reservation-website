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

router.get('/show-city', (req, res) => {
    const partial_city_name = req.query.city;
    const like_value = `%${partial_city_name}%`;
    const select_city_query = 'SELECT city_name FROM city WHERE city_name LIKE ? AND available = 1';
    db.query(select_city_query, [like_value], (select_error, select_results) =>{
        if (select_error)
            console.log(select_error);
        res.send(select_results);
    });
});

router.get('/search-tickets', (req, res) => {
    const {source, destination, date, passengers} = req.query;
    const select_ticket_query = `
        SELECT ticket.ticket_id, ticket.train_id, train.source_station, train.destination_station,
        train.train_name, train_scheduel.departure_date, train_scheduel.arrival_date,
        TIME_FORMAT(train_scheduel.departure_time, "%H:%i") as departure_time,
        TIME_FORMAT(train_scheduel.arrival_time, "%H:%i") as arrival_time,
        ticket.number_of_remaining_tickets, ticket.price
        FROM ticket, train, train_scheduel
        WHERE ticket.train_id = train.train_id
        AND train.scheduel = train_scheduel.scheduel_id
        AND train.source_station = ? AND train.destination_station = ?
        AND train_scheduel.departure_date = ? AND ticket.number_of_remaining_tickets >= ?;
    `;
    db.query(select_ticket_query, [source, destination, date, passengers], (error, results) => {
        if (error)
            console.log(error);
        else {
            res.send(results);
        }
    });
});

module.exports = router;