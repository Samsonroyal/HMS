const express = require('express');
const bcrypt = require('bcrypt');
const admin = express.Router();

const db = require('../../../utils/db');
const { authenticate, signToken } = require('../../../utils/auth');
const { authLimiter, apiLimiter } = require('../../../utils/rateLimiters');

function isValidEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
}

admin.post('/register', authLimiter, (req, res) => {
    const { first_name, last_name, email, phone_no, designation, password, address, salary } = req.body;

    if (!first_name || !last_name || !email || !password || !designation) {
        return res.status(400).json({ error: 'Please provide first name, last name, email, designation and password' });
    }
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    if (salary !== undefined && salary !== '' && isNaN(Number(salary))) {
        return res.status(400).json({ error: 'Salary must be a number' });
    }

    const find = `SELECT * FROM admin WHERE email = ?`;

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

                const create = `INSERT INTO admin (first_name, last_name, email, phone_no, designation, password, salary, address)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

                db.query(create, [first_name, last_name, email, phone_no, designation, hash, salary, address], (err2) => {
                    if (err2) {
                        console.log(err2);
                        return res.status(500).json({ error: 'Server error' });
                    }
                    res.status(201).json({ message: 'Employee registered successfully' });
                });
            });
        } else {
            res.status(409).json({ error: 'admin already exist...' });
        }
    });
});

admin.post('/login', authLimiter, (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Please provide email and password' });
    }

    const find = `SELECT password, admin_id FROM admin WHERE email = ?`;

    db.query(find, [email], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result[0] !== undefined) {
            if (bcrypt.compareSync(password, result[0].password)) {
                res.json({ token: signToken(result[0].admin_id) });
            } else {
                res.status(401).json({ error: 'Password incorrect' });
            }
        } else {
            res.status(404).json({ error: 'Email not found' });
        }
    });
});

admin.get('/details', (req, res) => {
    const admin_id = authenticate(req, res);
    if (!admin_id) return;

    const sql = `SELECT * FROM admin WHERE admin_id = ?`;
    db.query(sql, [admin_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.send(result);
    });
});

admin.post('/delete', apiLimiter, (req, res) => {
    const { admin_id } = req.body;

    if (!admin_id) {
        return res.status(400).json({ error: 'Please provide an admin id' });
    }

    const find = `SELECT * FROM admin WHERE admin_id = ?`;

    db.query(find, [admin_id], (err1, result1) => {
        if (err1) {
            console.log(err1);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result1[0] !== undefined) {
            db.query(`DELETE FROM admin WHERE admin_id = ?`, [admin_id], (err2) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).json({ error: 'Server error' });
                }
                res.json({ message: 'DELETED' });
            });
        } else {
            res.status(404).json({ error: 'Admin not found' });
        }
    });
});

admin.post('/assign_doctor', apiLimiter, (req, res) => {
    const { patient_id, doctor_id } = req.body;

    if (!patient_id || !doctor_id) {
        return res.status(400).json({ error: 'Please provide both patient id and doctor id' });
    }

    const sql = `SELECT * FROM assign_doctor WHERE patient_id = ?`;

    db.query(sql, [patient_id], (err1, result1) => {
        if (err1) {
            console.log(err1);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result1[0] === undefined) {
            const create = `INSERT INTO assign_doctor (patient_id, doctor_id) VALUES (?, ?)`;
            db.query(create, [patient_id, doctor_id], (err2) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).json({ error: 'Server error' });
                }
                res.status(201).json({ message: 'Doctor assigned successfully' });
            });
        } else {
            res.status(409).json({ error: 'already exist...' });
        }
    });
});

admin.post('/bill', apiLimiter, (req, res) => {
    const { patient_email, medicine_cost, room_charge, misc_charge, operation_charge } = req.body;

    if (!patient_email || !isValidEmail(patient_email)) {
        return res.status(400).json({ error: 'Please provide a valid patient email' });
    }

    const charges = [medicine_cost, room_charge, misc_charge, operation_charge];
    if (charges.some(c => c === undefined || c === '' || isNaN(Number(c)))) {
        return res.status(400).json({ error: 'All charge fields must be numbers' });
    }

    const sql = `SELECT * FROM patient WHERE email = ?`;

    db.query(sql, [patient_email], (err1, result1) => {
        if (err1) {
            console.log(err1);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result1[0] !== undefined) {
            const update = `UPDATE bill
                            SET
                                medicine_cost = medicine_cost + ?,
                                operation_charge = operation_charge + ?,
                                room_charge = room_charge + ?,
                                misc_charge = misc_charge + ?
                            WHERE patient_id = ?`;

            db.query(update, [medicine_cost, operation_charge, room_charge, misc_charge, result1[0].patient_id], (err2) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).json({ error: 'Server error' });
                }
                res.json({ message: 'Bill updated successfully' });
            });
        } else {
            res.status(404).json({ error: 'Patient not found' });
        }
    });
});

module.exports = admin;
