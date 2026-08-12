const express = require('express');
const bcrypt = require('bcrypt');
const patient = express.Router();

const db = require('../../../utils/db');
const { signToken, requireRole } = require('../../../utils/auth');
const { authLimiter } = require('../../../utils/rateLimiters');
const { logActivity } = require('../../../utils/activityLog');

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
                            logActivity('patient', patient_id, 'Patient registered', `${first_name} ${last_name}`);
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
                logActivity('patient', result[0].patient_id, 'Patient logged in');
                res.json({ token: signToken(result[0].patient_id, 'patient') });
            } else {
                res.status(401).json({ error: 'Password incorrect' });
            }
        } else {
            res.status(404).json({ error: 'Email not found' });
        }
    });
});

patient.get('/profile', requireRole('patient'), (req, res) => {
    const patient_id = req.user.id;

    const patient = `SELECT patient_id, first_name, last_name, address, email, phone_no, disease
                    FROM patient WHERE patient_id = ?`;
    db.query(patient, [patient_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.send(result);
    });
});

patient.get('/details', requireRole('patient'), (req, res) => {
    const patient_id = req.user.id;

    const sql = `SELECT patient_id, first_name, last_name, address, email, phone_no, disease
                FROM patient WHERE patient_id = ?`;
    db.query(sql, [patient_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.send(result);
    });
});

patient.get('/doctor', requireRole('patient'), (req, res) => {
    const patient_id = req.user.id;

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

patient.get('/bill', requireRole('patient'), (req, res) => {
    const patient_id = req.user.id;

    const bill = `SELECT * FROM bill WHERE patient_id = ?`;
    db.query(bill, [patient_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.send(result);
    });
});

// Patients update their own non-identity details (email/password are not self-service).
patient.patch('/update', requireRole('patient'), (req, res) => {
    const patient_id = req.user.id;
    const { first_name, last_name, address, phone_no, disease } = req.body;

    if (!first_name && !last_name && !address && !phone_no && !disease) {
        return res.status(400).json({ error: 'Please provide at least one field to update' });
    }
    if (first_name !== undefined && !String(first_name).trim()) {
        return res.status(400).json({ error: 'First name cannot be empty' });
    }
    if (last_name !== undefined && !String(last_name).trim()) {
        return res.status(400).json({ error: 'Last name cannot be empty' });
    }

    const update = `UPDATE patient SET
                        first_name = COALESCE(?, first_name),
                        last_name = COALESCE(?, last_name),
                        address = COALESCE(?, address),
                        phone_no = COALESCE(?, phone_no),
                        disease = COALESCE(?, disease)
                    WHERE patient_id = ?`;

    db.query(update, [first_name, last_name, address, phone_no, disease, patient_id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        logActivity('patient', patient_id, 'Profile updated');
        res.json({ message: 'Profile updated successfully' });
    });
});

// Change the password of the currently authenticated patient.
patient.post('/change_password', requireRole('patient'), authLimiter, (req, res) => {
    const patient_id = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
        return res.status(400).json({ error: 'Please provide your current and new password' });
    }
    if (String(new_password).length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    db.query(`SELECT password FROM patient WHERE patient_id = ?`, [patient_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result[0] === undefined) {
            return res.status(404).json({ error: 'Account not found' });
        }

        if (!bcrypt.compareSync(current_password, result[0].password)) {
            return res.status(401).json({ error: 'Current password is incorrect' });
        }

        bcrypt.hash(new_password, 10, (errHash, hash) => {
            if (errHash) {
                console.log(errHash);
                return res.status(500).json({ error: 'Server error' });
            }
            db.query(`UPDATE patient SET password = ? WHERE patient_id = ?`, [hash, patient_id], (err2) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).json({ error: 'Server error' });
                }
                logActivity('patient', patient_id, 'Password changed');
                res.json({ message: 'Password changed successfully' });
            });
        });
    });
});

module.exports = patient;
