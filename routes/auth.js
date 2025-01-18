const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const mysql = require('mysql2');
const crypto = require('crypto');

//Database connection
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
});

// send vertification code to user's email
function send_email(email, code) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS
        }
    });
    var mail_options = {
        from: process.env.EMAIL,
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
        else {
            send_email(email, code);
        }
    });
}

// genrate 5 digit random number as vertification code
function generate_code() {
    min = Math.ceil(10000);
    max = Math.floor(99999);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

router.get('/signin', (req, res) => {
    const { email } = req.query;
    const select_email_q = 'SELECT * FROM user WHERE email = ?';

    // check if the email already exists
    db.query(select_email_q, email, async (select_user_error, select_user_result) => {
        if (select_user_error) {
            console.log(select_user_error);
        }
        else {
            // If the email is not registered, insert it.
            if (select_user_result.length <= 0) {
                const insert_mail = 'INSERT INTO user(email, password, role) VALUES(?, ?, ?)';
                password = '0';
                password = crypto.createHash('sha256').update(password).digest('hex');
                role = 'user';
                db.query(insert_mail, [email, password, role], (insert_error, insert_result) => {
                    if (insert_error) {
                        console.log(insert_error);
                    }
                });
                
            }

            // check if a valid vertification code already exists for the email
            db.query('SELECT * FROM vertification_code WHERE email = ?', [email], (select_ver_code_error, select_ver_code_result) => {
                if (select_ver_code_error) {
                    console.log(select_ver_code_error);
                }
                else {
                    if (select_ver_code_result.length > 0) {
                        // if the code is not expired, proceed
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
            });
        }
    });
});

router.get('/signout', (req, res) => {
    res.clearCookie('email');
    res.json({ success: true});
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
                const delete_query = 'DELETE FROM vertification_code WHERE email = ? AND code = ?';
                db.query(delete_query, [email, code], (delete_error, delete_result) => {
                    if (delete_error) {
                        console.log(error);
                    }
                    else {
                        res.cookie('email', email, {
                            httpOnly: false, // allow client-side access
                            maxAge: 24 * 60 * 60 * 1000 //one day expiry
                        });
                        res.json({ success: true});
                    }
                });
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