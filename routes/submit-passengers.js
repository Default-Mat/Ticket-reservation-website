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
    const select_ticket = 'SELECT available_tickets, price FROM ticket WHERE ticket_id = ?';
    db.query(select_ticket, [ticketId], (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            const {available_tickets, price} = result[0];
            if (available_tickets >= total_passengers) {
                const total_price = price * total_passengers;
                const res_data = {
                    gender,
                    firstname,
                    lastname,
                    idnum,
                    birthdate,
                    ticketId,
                    price: total_price
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