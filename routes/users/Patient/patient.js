const express = require('express');
const bcrypt = require('bcrypt');
const patient = express.Router();

const db = require('../../../utils/db');
const { authenticate, signToken } = require('../../../utils/auth');
const { authLimiter } = require('../../../utils/rateLimiters');

function isValidEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
}

patient.post('/register', authLimiter, (req, res) => {
    const { first_name, last_name, address, email, phone_no, password, disease } = req.body;

    if (!first_name || !last_name || !email || !password || !phone_no) {
        return res.status(400).json({ error: 'Please provide first name, last name, email, phone number and password' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
    }

    const find = `SELECT * FROM patient WHERE email = ?`;

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

                const create = `INSERT INTO patient (first_name, last_name, address, email, phone_no, password, disease)
                                VALUES (?, ?, ?, ?, ?, ?, ?)`;

                db.query(create, [first_name, last_name, address, email, phone_no, hash, disease], (err2) => {
                    if (err2) {
                        console.log(err2);
                        return res.status(500).json({ error: 'Server error' });
                    }

                    db.query(find, [email], (err3, result3) => {
                        if (err3) {
                            console.log(err3);
                            return res.status(500).json({ error: 'Server error' });
                        }

                        const patient_id = result3[0].patient_id;

                        db.query(`INSERT INTO bill (patient_id) VALUES (?)`, [patient_id], (err4) => {
                            if (err4) {
                                console.log(err4);
                                return res.status(500).json({ error: 'Server error' });
                            }
                            res.status(201).json({ message: 'Patient registered successfully' });
                        });
                    });
                });
            });
        } else {
            res.status(409).json({ error: 'user already exist...' });
        }
    });
});

patient.post('/login', authLimiter, (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    const find = `SELECT password, patient_id FROM patient WHERE email = ?`;

    db.query(find, [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result[0] !== undefined) {
            if (bcrypt.compareSync(password, result[0].password)) {
                res.json({ token: signToken(result[0].patient_id) });
            } else {
                res.status(401).json({ error: 'Password incorrect' });
            }
        } else {
            res.status(404).json({ error: 'Email not found' });
        }
    });
});

patient.get('/profile', (req, res) => {
    const patient_id = authenticate(req, res);
    if (!patient_id) return;

    const patient = `SELECT * FROM patient WHERE patient_id = ?`;
    db.query(patient, [patient_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.send(result);
    });
});

patient.get('/details', (req, res) => {
    const patient_id = authenticate(req, res);
    if (!patient_id) return;

    const sql = `SELECT * FROM patient WHERE patient_id = ?`;
    db.query(sql, [patient_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.send(result);
    });
});

patient.get('/doctor', (req, res) => {
    const patient_id = authenticate(req, res);
    if (!patient_id) return;

    const sql = `SELECT
                    d.first_name as doctor_firstname,
                    d.last_name doctor_lastname,
                    d.specialisation
                FROM assign_doctor ad
                    JOIN patient p ON p.patient_id = ad.patient_id
                    JOIN doctors d ON ad.doctor_id = d.doctor_id
                WHERE p.patient_id = ?`;
    db.query(sql, [patient_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.send(result);
    });
});

patient.get('/bill', (req, res) => {
    const patient_id = authenticate(req, res);
    if (!patient_id) return;

    const bill = `SELECT * FROM bill WHERE patient_id = ?`;
    db.query(bill, [patient_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.send(result);
    });
});

module.exports = patient;
