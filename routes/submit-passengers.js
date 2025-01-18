const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const nodemailer = require('nodemailer');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

async function executeQueries(query, inputData) {
    try {
        let purchased_tickets_data = [];
        for (const id of inputData) {
            const [purchased_ticket_db] = await db.promise().query(query, id);
            purchased_tickets_data.push(purchased_ticket_db[0]);
        }
        return purchased_tickets_data;
    } catch (error) {
        console.error('Error executing queries:', error);
        return false;
    }
}

function send_tickets(res, purchased_tickets, email) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });

    let text = ``;
    purchased_tickets.forEach(purchased_ticket => {
        text += `
            -------------------------------------------------
            -------------------------------------------------
            شماره‌ی قطار: ${purchased_ticket.train_id} | کد رهگیری: ${purchased_ticket.tracing_code} | شرکت ریلی: ${purchased_ticket.train_name}
            شماره سالن: ${purchased_ticket.wagon_number} | شماره صندلی: ${purchased_ticket.seat_number}
            مبدا: ${purchased_ticket.source_station} | مقصد: ${purchased_ticket.destination_station}
            ساعت و تاریخ حرکت: ${purchased_ticket.departure_date} - ${purchased_ticket.departure_time}
            ساعت و تاریخ ورود: ${purchased_ticket.arrival_date} - ${purchased_ticket.arrival_time}
            نوع سالن: ${purchased_ticket.train_type} | نوع سرویس: ${purchased_ticket.service_type}
            نام و نام خانوادگی مسافر: ${purchased_ticket.first_name} ${purchased_ticket.last_name}
            قیمت نهایی: ${purchased_ticket.price} ریال
            -------------------------------------------------
            -------------------------------------------------

        `;
    });

    var mail_options = {
        from: process.env.EMAIL,
        to: email,
        subject: 'بلیت قطار',
        text: text
    };

    transporter.sendMail(mail_options, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).send('مشکلی در ارسال بلیت پیش آمده');
        }
        else {
            console.log('Email sent: ' + info.response);
            return res.status(200).send('Success');
        }
    });
}

function is_repeated(ticket, purchased_tickets) {
    const ticket_id = ticket.ticketInfo.ticketId;
    const purchased_tickets_id = purchased_tickets[0].ticket_id;
    const passengers = ticket.passengers;

    console.log('test');

    if ((ticket_id != purchased_tickets_id) || passengers.length != purchased_tickets.length) {
        console.log('first if');
        console.log(ticket_id, purchased_tickets_id);
        console.log(passengers.length, purchased_tickets.length);
        return false;
    }

    let equality_counter = 0;
    for (const purchased_ticket of purchased_tickets) {
        for (const passenger of passengers) {
            if (purchased_ticket.id_number == passenger.idnum)
                equality_counter ++;
        }
    }
    console.log(equality_counter)
    if (equality_counter == passengers.length){
        console.log('is_repeated: true')
        return true;
    }
    else {
        console.log('is_repeated: false')
        return false;
    }

}



router.get('/set-ticketid', (req, res) => {
    const {ticketId} = req.query;
    req.session.ticketId = ticketId;
    res.status(200).send('Success');
});



router.post('/confirmation', async (req, res) => {
    let { gender, firstname, lastname, idnum, birthdate } = req.body;
    let ticketId = req.session.ticketId;
    console.log(`session ticketId: ${req.session.ticketId}`);

    // // If the selected ticket is the same as the one in session
    // // storage respond with session data
    // console.log(`session ticket: ${req.session.ticket}`);
    // if (req.session.ticket) {
    //     session_ticket = req.session.ticket;
    //     if (session_ticket.ticketInfo.ticketId == ticketId) {
    //         return res.render('confirm', {
    //             ticket: session_ticket
    //         });
    //     }
    // }

    if (!gender || !firstname || !lastname || !idnum || !birthdate) {
        return res.status(400).send('Invalid data');
    }

    if (!Array.isArray(idnum)) {
        gender = [gender];
        firstname = [firstname];
        lastname = [lastname];
        idnum = [idnum];
        birthdate = [birthdate];
    }
    const total_passengers = idnum.length;

    const select_ticket = `
        SELECT ticket.ticket_id, ticket.train_id, ticket.wagon_number,
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
    try {
        // Select the ticket data from db
        const [result] = await db.promise().query(select_ticket, [ticketId]);
        const {ticket_id, train_id, wagon_number, source_station,
            destination_station, train_name, train_type,
            departure_date, arrival_date,
            departure_time, arrival_time,
            available_tickets, price} = result[0];
        
        // If there are enough seats proceed
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
                ticket_id, train_id, wagon_number, source_station,
                destination_station, train_name, train_type,
                departure_date, arrival_date,
                departure_time, arrival_time,
                ticketId, totalPrice
            };
            
            // Save ticket info in session and respond
            // with confirm page
            req.session.ticket = res_data;
            res.render('confirm', {
                ticket: res_data
            });

        }
        else {
            res.status(500).send('تعداد صندلی کافی موجود نیست');
        }
    }
    catch(error) {
        return console.error('Error executing query:', error);
    }
});



router.post('/submit', async (req, res) => {
    const {email, phoneNumber} = req.body;
    // check if the purchased ticket is repetitive
    if (req.session.purchased_tickets){
        console.log(req.session.purchased_tickets)
        if (is_repeated(req.session.ticket, req.session.purchased_tickets)) {
            send_tickets(res, req.session.purchased_tickets, email);
            return;
        }
    }

    const passengers = req.session.ticket.passengers;
    const ticketInfo = req.session.ticket.ticketInfo;

    const select_ticket = `
        SELECT ticket.ticket_id, ticket.train_id, ticket.wagon_number,
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
    // check ticket again for security
    // and certainty
    try {
        const [select_result] = await db.promise().query(select_ticket, [ticketInfo.ticket_id]);
        const {available_tickets} = select_result[0];

        if (available_tickets < passengers.length) {
            return res.status(500).send('تعداد صندلی کافی موجود نیست');
        }
        // const totalPrice = price * passengers.length;
        let purchased_tickets = [];
        let ticket_data = [];
        // push each passenger's purchased ticket info into an array
        passengers.forEach(passenger => {
            ticket_data = [
                ticketInfo.ticket_id,
                email,
                phoneNumber,
                passenger.idnum,
                passenger.firstname,
                passenger.lastname,
                passenger.birthdate,
                passenger.gender,
                passenger.services,
                'purchased'
            ];
            purchased_tickets.push(ticket_data);
        });

        const insert_passengers = `INSERT INTO 
        purchased_ticket(ticket_id, email, phone_number, id_number, first_name, last_name, birth_date, sex, service_type, status)
        VALUES ?`;
        // Insert passengers' purchased tickets
        await db.promise().query(insert_passengers, [purchased_tickets]);

        const select_pur_ticket = `
            SELECT purchased_ticket.tracing_code, ticket.ticket_id, ticket.train_id, ticket.wagon_number,
            c1.city_name AS source_station, c2.city_name AS destination_station,
            train.train_name, train.train_type,
            DATE_FORMAT(train_schedule.departure_date, "%Y-%m-%d") AS departure_date,
            DATE_FORMAT(train_schedule.arrival_date, "%Y-%m-%d") AS arrival_date,
            TIME_FORMAT(train_schedule.departure_time, "%H:%i") AS departure_time,
            TIME_FORMAT(train_schedule.arrival_time, "%H:%i") AS arrival_time,
            ticket.price, first_name, last_name, id_number, service_type
            FROM purchased_ticket, ticket, train, train_schedule, city AS c1, city AS c2
            WHERE ticket.train_id = train.train_id
            AND purchased_ticket.ticket_id = ticket.ticket_id
            AND train.schedule_id = train_schedule.schedule_id
            AND train.source_station = c1.city_id AND train.destination_station = c2.city_id
            AND ticket.ticket_id = ? AND purchased_ticket.id_number = ?;
        `;
        let select_data = [];
        let ticket_data_2 = [];
        // push each passenger's idnum and ticket id into an array
        passengers.forEach(passenger => {
            ticket_data_2 = [
                ticketInfo.ticket_id,
                passenger.idnum
            ];
            select_data.push(ticket_data_2);
        });
        // Select each passenger's ticket info
        // in order to use the assigned tracing code
        const selected_purchased_tickets = await executeQueries(select_pur_ticket, select_data);

        const select_seat = `
        SELECT seat_id, seat_number FROM seat_allocation
        WHERE ticket_id = ? AND tracing_code is null
        LIMIT ?;
        `;
        // select available seats
        const [seat_ids] = await db.promise().query(select_seat, [ticketInfo.ticketId, passengers.length]);

        const allocate_seat = 'UPDATE seat_allocation SET tracing_code = ? WHERE seat_id = ?;';
        const decrement_available_tickets = `
        UPDATE ticket SET available_tickets = available_tickets - 1
        WHERE ticket_id = ?;
        `;
        for (let i = 0; i < selected_purchased_tickets.length; i++) {
            const selected_purchased_ticket = selected_purchased_tickets[i];
            // Allocate seat
            await db.promise().query(allocate_seat, [selected_purchased_ticket.tracing_code, seat_ids[i].seat_id]);
            // Add seat number to ticket info
            selected_purchased_ticket.seat_number = seat_ids[i].seat_number;
            // Decrement available seats
            await db.promise().query(decrement_available_tickets, [selected_purchased_ticket.ticket_id]);
        }

        // if there was no error
        if (selected_purchased_tickets) {
            // Save the purchased tickets in session
            // for future use
            req.session.purchased_tickets = selected_purchased_tickets;
            send_tickets(res, selected_purchased_tickets, email);
        }
        else {
            res.status(500).send('مشکلی در ثبت مسافران پیش آمده');
        }
    }
    catch(error) {
        return console.error('Error executing query:', error);
    }
});


module.exports = router;