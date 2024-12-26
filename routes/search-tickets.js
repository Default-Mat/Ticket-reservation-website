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

router.get('/', (req, res) => {
    const {source, destination, date, passengers} = req.query;
    const select_ticket_query = `
        SELECT ticket.ticket_id, ticket.train_id, ticket.wagon_number,
        c1.city_name AS source_station, c2.city_name AS destination_station,
        train.train_name, train.train_type,
        train_schedule.departure_date, train_schedule.arrival_date,
        TIME_FORMAT(train_schedule.departure_time, "%H:%i") AS departure_time,
        TIME_FORMAT(train_schedule.arrival_time, "%H:%i") AS arrival_time,
        ticket.available_tickets, ticket.price
        FROM ticket, train, train_schedule, city AS c1, city AS c2
        WHERE ticket.train_id = train.train_id
        AND train.schedule_id = train_schedule.schedule_id
        AND train.source_station = c1.city_id AND train.destination_station = c2.city_id
        AND c1.city_name = ? AND c2.city_name = ?
        AND train_schedule.departure_date = ? AND ticket.available_tickets >= ?;
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