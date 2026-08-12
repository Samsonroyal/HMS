const express = require('express');
const bcrypt = require('bcrypt');
const doctor = express.Router();

const db = require('../../../utils/db');
const { authenticate, signToken } = require('../../../utils/auth');
const { authLimiter, apiLimiter } = require('../../../utils/rateLimiters');

function isValidEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
}

doctor.post('/register', authLimiter, (req, res) => {
    const { first_name, last_name, address, email, salary, specialisation, shift_time, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: 'Please provide first name, last name, email and password' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const find = `SELECT * FROM doctors WHERE email = ?`;

    db.query(find, [email], (err1, result1) => {
        if (err1) {
            console.log(err1);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result1[0] === undefined) {
            bcrypt.hash(password, 10, (errHash, hash) => {
                if (errHash) {
                    console.log(errHash);
                    return res.status(500).json({ error: 'Server error' });
                }

                const create = `INSERT INTO doctors (first_name, last_name, address, email, salary, specialisation, shift_time, password)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

                db.query(create, [first_name, last_name, address, email, salary, specialisation, shift_time, hash], (err2) => {
                    if (err2) {
                        console.log(err2);
                        return res.status(500).json({ error: 'Server error' });
                    }
                    res.status(201).json({ message: 'Doctor registered successfully' });
                });
            });
        } else {
            res.status(409).json({ error: 'doctor already exist...' });
        }
    });
});

doctor.post('/login', authLimiter, (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    const find = `SELECT password, doctor_id FROM doctors WHERE email = ?`;

    db.query(find, [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result[0] !== undefined) {
            if (bcrypt.compareSync(password, result[0].password)) {
                res.json({ token: signToken(result[0].doctor_id) });
            } else {
                res.status(401).json({ error: 'Password incorrect' });
            }
        } else {
            res.status(404).json({ error: 'Email not found' });
        }
    });
});

doctor.get('/patient', (req, res) => {
    const doctor_id = authenticate(req, res);
    if (!doctor_id) return;

    const sql = `SELECT
                    p.patient_id,
                    p.first_name,
                    p.last_name
                FROM assign_doctor ad
                    JOIN patient p ON p.patient_id = ad.patient_id
                    JOIN doctors d ON d.doctor_id = ad.doctor_id
                WHERE ad.doctor_id = ?`;
    db.query(sql, [doctor_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.send(result);
    });
});

doctor.get('/profile', (req, res) => {
    const doctor_id = authenticate(req, res);
    if (!doctor_id) return;

    const sql = `SELECT * FROM doctors WHERE doctor_id = ?`;
    db.query(sql, [doctor_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.send(result);
    });
});

doctor.post('/delete', apiLimiter, (req, res) => {
    const { doctor_id } = req.body;

    if (!doctor_id) {
        return res.status(400).json({ error: 'Please provide a doctor id' });
    }

    const find = `SELECT * FROM doctors WHERE doctor_id = ?`;

    db.query(find, [doctor_id], (err1, result1) => {
        if (err1) {
            console.log(err1);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result1[0] !== undefined) {
            db.query(`DELETE FROM doctors WHERE doctor_id = ?`, [doctor_id], (err2) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).json({ error: 'Server error' });
                }
                res.json({ message: 'DELETED' });
            });
        } else {
            res.status(404).json({ error: 'Doctor not found' });
        }
    });
});

doctor.post('/update_sal', apiLimiter, (req, res) => {
    const { doctor_id, salary } = req.body;

    if (!doctor_id || salary === undefined || isNaN(Number(salary))) {
        return res.status(400).json({ error: 'Please provide a valid doctor id and numeric salary' });
    }

    const find = `SELECT * FROM doctors WHERE doctor_id = ?`;

    db.query(find, [doctor_id], (err1, result1) => {
        if (err1) {
            console.log(err1);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result1[0] !== undefined) {
            db.query(`UPDATE doctors SET salary = ? WHERE doctor_id = ?`, [salary, doctor_id], (err2) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).json({ error: 'Server error' });
                }
                res.json({ message: 'UPDATED' });
            });
        } else {
            res.status(404).json({ error: 'Doctor not found' });
        }
    });
});

module.exports = doctor;
