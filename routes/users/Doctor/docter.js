const express = require('express');
const bcrypt = require('bcrypt');
const doctor = express.Router();

const db = require('../../../utils/db');
const { signToken, requireRole } = require('../../../utils/auth');
const { authLimiter, apiLimiter } = require('../../../utils/rateLimiters');
const { logActivity } = require('../../../utils/activityLog');

function isValidEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
}

// Doctor accounts are created by staff/administrators only.
doctor.post('/register', requireRole('admin'), authLimiter, (req, res) => {
    const { first_name, last_name, address, email, salary, specialisation, shift_time, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: 'Please provide first name, last name, email and password' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    if (salary !== undefined && salary !== '' && (isNaN(Number(salary)) || Number(salary) < 0)) {
        return res.status(400).json({ error: 'Salary must be a non-negative number' });
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

                    db.query(find, [email], (err3, result3) => {
                        if (err3) {
                            console.log(err3);
                            return res.status(500).json({ error: 'Server error' });
                        }
                        const doctor_id = result3[0].doctor_id;
                        logActivity('doctor', doctor_id, 'Doctor account created', `${first_name} ${last_name}`);
                        res.status(201).json({ message: 'Doctor registered successfully' });
                    });
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
                logActivity('doctor', result[0].doctor_id, 'Doctor logged in');
                res.json({ token: signToken(result[0].doctor_id, 'doctor') });
            } else {
                res.status(401).json({ error: 'Password incorrect' });
            }
        } else {
            res.status(404).json({ error: 'Email not found' });
        }
    });
});

doctor.get('/patient', requireRole('doctor'), (req, res) => {
    const doctor_id = req.user.id;

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

doctor.get('/profile', requireRole('doctor'), (req, res) => {
    const doctor_id = req.user.id;

    const sql = `SELECT doctor_id, first_name, last_name, address, email, salary, specialisation, shift_time
                FROM doctors WHERE doctor_id = ?`;
    db.query(sql, [doctor_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.send(result);
    });
});

// Doctors update their own non-identity details (email, salary and password are not self-service).
doctor.patch('/profile', requireRole('doctor'), (req, res) => {
    const doctor_id = req.user.id;
    const { first_name, last_name, address, specialisation, shift_time } = req.body;

    if (!first_name && !last_name && !address && !specialisation && !shift_time) {
        return res.status(400).json({ error: 'Please provide at least one field to update' });
    }
    if (first_name !== undefined && !String(first_name).trim()) {
        return res.status(400).json({ error: 'First name cannot be empty' });
    }
    if (last_name !== undefined && !String(last_name).trim()) {
        return res.status(400).json({ error: 'Last name cannot be empty' });
    }

    const update = `UPDATE doctors SET
                        first_name = COALESCE(?, first_name),
                        last_name = COALESCE(?, last_name),
                        address = COALESCE(?, address),
                        specialisation = COALESCE(?, specialisation),
                        shift_time = COALESCE(?, shift_time)
                    WHERE doctor_id = ?`;

    db.query(update, [first_name, last_name, address, specialisation, shift_time, doctor_id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        logActivity('doctor', doctor_id, 'Profile updated');
        res.json({ message: 'Profile updated successfully' });
    });
});

// Change the password of the currently authenticated doctor.
doctor.post('/change_password', requireRole('doctor'), authLimiter, (req, res) => {
    const doctor_id = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
        return res.status(400).json({ error: 'Please provide your current and new password' });
    }
    if (String(new_password).length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    db.query(`SELECT password FROM doctors WHERE doctor_id = ?`, [doctor_id], (err, result) => {
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
            db.query(`UPDATE doctors SET password = ? WHERE doctor_id = ?`, [hash, doctor_id], (err2) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).json({ error: 'Server error' });
                }
                logActivity('doctor', doctor_id, 'Password changed');
                res.json({ message: 'Password changed successfully' });
            });
        });
    });
});

doctor.post('/delete', requireRole('admin'), apiLimiter, (req, res) => {
    const { doctor_id } = req.body;

    if (!doctor_id || !Number.isInteger(Number(doctor_id)) || Number(doctor_id) <= 0) {
        return res.status(400).json({ error: 'Please provide a valid doctor id' });
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
                logActivity('admin', req.user.id, 'Doctor deleted', `doctor id ${doctor_id}`);
                res.json({ message: 'DELETED' });
            });
        } else {
            res.status(404).json({ error: 'Doctor not found' });
        }
    });
});

doctor.post('/update_sal', requireRole('admin'), apiLimiter, (req, res) => {
    const { doctor_id, salary } = req.body;

    if (!doctor_id || salary === undefined || isNaN(Number(salary)) || Number(salary) < 0 ||
        !Number.isInteger(Number(doctor_id)) || Number(doctor_id) <= 0) {
        return res.status(400).json({ error: 'Please provide a valid doctor id and non-negative numeric salary' });
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
                logActivity('admin', req.user.id, 'Doctor salary updated', `doctor id ${doctor_id} -> ${salary}`);
                res.json({ message: 'UPDATED' });
            });
        } else {
            res.status(404).json({ error: 'Doctor not found' });
        }
    });
});

module.exports = doctor;
