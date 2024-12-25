const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

router.post('/confirm', async (req, res) => {
    const { gender, firstname, lastname, idnum, birthdate } = req.body;

    if (!gender || !firstname || !lastname || !idnum || !birthdate) {
        return res.status(400).send('Invalid data');
    }

    const passengers = firstname.map((_, index) => ({
        firstname: firstname[index],
        lastname: lastname[index],
        idnum: idnum[index],
        birthdate: birthdate[index],
        gender: gender[index]
    }));

    const query = `INSERT INTO passengers
    (ticket_id, email, phone_number, id_number, first_name, last_name, birth_date, sex, service_type, status) VALUES ?`;
    const values = passengers.map((p) => [p.gender, p.firstname, p.lastname, p.idnum, p.birthdate]);
    db.query(query, [values], (error, result) => {
        if (error) {
            console.log(error);
            res.status(500).send('Database error');
        }
        else {
            res.status(200).send('Passengers added successfully');
        }
    });
});

router.post('/check-price', (req, res) => {
    const { gender, firstname, lastname, idnum, birthdate, ticketId } = req.body;

    if (!gender || !firstname || !lastname || !idnum || !birthdate) {
        return res.status(400).send('Invalid data');
    }

    const total_passengers = idnum.length;
    const select_ticket = `
        SELECT ticket.ticket_id, ticket.train_id,
        c1.city_name AS source_station, c2.city_name AS destination_station,
        train.train_name, train.train_type,
        DATE_FORMAT(train_schedule.departure_date, "%Y-%m-%d") AS departure_date,
        DATE_FORMAT(train_schedule.arrival_date, "%Y-%m-%d") AS arrival_date,
        TIME_FORMAT(train_schedule.departure_time, "%H:%i") AS departure_time,
        TIME_FORMAT(train_schedule.arrival_time, "%H:%i") AS arrival_time,
        ticket.available_tickets, ticket.price
        FROM ticket, train, train_schedule, city AS c1, city AS c2
        WHERE ticket.train_id = train.train_id
        AND train.schedule_id = train_schedule.schedule_id
        AND train.source_station = c1.city_id AND train.destination_station = c2.city_id
        AND ticket.ticket_id = ?;
    `;
    db.query(select_ticket, [ticketId], (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            const {ticket_id, train_id, source_station,
                 destination_station, train_name, train_type,
                 departure_date, arrival_date,
                 departure_time, arrival_time,
                 available_tickets, price} = result[0];

            if (available_tickets >= total_passengers) {
                const totalPrice = price * total_passengers;
                const res_data = {passengers: []};
                for (let i = 0; i < total_passengers; i++) {
                    const passen = {
                        ageRange: "بزرگسال",
                        gender: gender[i],
                        firstname: firstname[i],
                        lastname: lastname[i],
                        idnum: idnum[i],
                        birthdate: birthdate[i],
                        services: "بدون سرویس",
                        serviceAmount: "0",
                        price,
                    };
                    res_data.passengers.push(passen);
                }
                res_data.ticketInfo = {
                    ticket_id, train_id, source_station,
                    destination_station, train_name, train_type,
                    departure_date, arrival_date,
                    departure_time, arrival_time,
                    ticketId, totalPrice
                };
                res.cookie('passengers', JSON.stringify(res_data), {
                    httpOnly: false, // allow client-side access
                    maxAge: 24 * 60 * 60 * 1000 //one day expiry
                });
                res.status(200).send('Success');
            }
            else {
                res.status(500).send('تعداد صندلی کافی موجود نیست');
            }
        }
    });
});


module.exports = router;