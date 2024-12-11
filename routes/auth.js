const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const mysql = require('mysql2');

//Database connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

// send email to user
function send_email(email, code) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'alibaba.tahlil.project@gmail.com',
            pass: 'qmaoepsbwcoxeayb'
        }
    });
    var mail_options = {
        from: 'matin.geralt6565@gmail.com',
        to: email,
        subject: 'کد تایید ایمیل',
        text: 'کد تایید شما: ' + code
    };

    transporter.sendMail(mail_options, (error, info) => {
        if (error) {
            console.log(error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function send_new_ver_code(email, res) {
    const timestamp = new Date();
    const code = generate_code();
    const insert_code = 'INSERT INTO vertification_code(email, code, created_at) VALUES(?, ?, ?);'

    // insert email vertification code
    db.query(insert_code, [email, code, timestamp], (insert_error, insert_result) => {
        if (insert_error) {
            console.log(insert_error);
        }
        // else {
        //     send_email(email, code);
        // }
    });
}

// genrate 5 digit random number as vertification code
const generate_code = () => Math.floor(10000 + Math.random() * 100000);

router.get('/signin', (req, res) => {
    const { email } = req.query;
    const select_email_q = 'SELECT * FROM user WHERE email = ?';

    // check if the email already exists
    db.query(select_email_q, email, async (select_user_error, select_user_result) => {
        if (select_user_error) {
            console.log(select_user_error);
        }
        else {
            if (select_user_result.length > 0) {

                // check if a valid vertification code already exists for the email
                db.query('SELECT * FROM vertification_code WHERE email = ?', [email], (select_ver_code_error, select_ver_code_result) => {
                    if (select_ver_code_error) {
                        console.log(select_ver_code_error);
                    }
                    else {
                        if (select_ver_code_result.length > 0) {
                            // if the code is not expired, procees
                            // else delete the expired code and send/insert a new one
                            if (new Date() - new Date(select_ver_code_result[0]['created_at']) < 10 * 60 * 1000){
                                res.redirect('/confirm_email.html');
                            }
                            else {
                                const delete_q = 'DELETE FROM vertification_code WHERE email = ?';
                                db.query(delete_q, [email], (delete_error, delete_result) => {
                                    if (delete_error) {
                                        console.log(delete_error);
                                    }
                                    else {
                                        send_new_ver_code(email, res);
                                        res.redirect('/confirm_email.html');
                                    }
                                });
                            }
                        }

                        // sends a new vertification code for the email and saves it on database
                        else {
                            send_new_ver_code(email, res);
                            res.redirect('/confirm_email.html');
                        }
                    }
                })
            }
            else {
                console.log('email doesnt exist');
                res.redirect('/authentication.html');
            }
        }
    });
});

router.get('/signout', (req, res) => {
    res.clearCookie('email');
    res.redirect('/home.html');
});

router.post('/verify-code', (req, res) => {
    const { email, code } = req.body;
    const select_ver_code = 'SELECT * FROM vertification_code WHERE email = ? AND code = ?';

    // check if the entered vertification code is valid
    db.query(select_ver_code, [email, code], (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            // console.log(result);
            // console.log((result.length > 0) && (new Date() - new Date(result[0]['created_at']) < 10 * 60 * 1000));
            if ((result.length > 0) && (new Date() - new Date(result[0]['created_at']) < 10 * 60 * 1000)) {
                res.cookie('email', email, {
                    httpOnly: false, // allow client-side access
                    maxAge: 24 * 60 * 60 * 1000 //one day expiry
                });
                res.json({ success: true, redirectTo: '/home.html' });
            }
            else {
                res.json({ success: false, redirectTo: '/confirm_email.html', message: 'کد وارد شده صحیح نیست یا منقضی شده است' });
            }
        }
    });
});

router.get('/resend-code', (req, res) => {
    const {email} = req.query;
    const delete_q = 'DELETE FROM vertification_code WHERE email = ?';
    db.query(delete_q, [email], (delete_error, delete_result) => {
        if (delete_error) {
            console.log(delete_error);
        }
        else {
            send_new_ver_code(email, res);
            res.json({ success: true, message: 'کد جدیدی برای شما ارسال شد'});
        }
    });
});

module.exports = router;