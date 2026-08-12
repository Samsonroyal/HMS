const express = require('express');

const router = express.Router();

const db = require('../../../utils/db');
const { authenticate } = require('../../../utils/auth');
const { apiLimiter } = require('../../../utils/rateLimiters');

router.post('/book', apiLimiter, (req, res) => {
    const patient_id = authenticate(req, res);
    if (!patient_id) return;

    const { doctor_id, appointment_date, appointment_time, reason } = req.body;

    if (!doctor_id || !appointment_date || !appointment_time) {
        return res.status(400).json({ error: 'Please select a doctor, date and time' });
    }

    const create = `INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
                    VALUES (?, ?, ?, ?, ?, 'pending')`;

    db.query(create, [patient_id, doctor_id, appointment_date, appointment_time, reason], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Could not book appointment' });
        }
        res.status(201).json({ message: 'Appointment booked successfully' });
    });
});

router.get('/patient', (req, res) => {
    const patient_id = authenticate(req, res);
    if (!patient_id) return;

    const sql = `SELECT
                    a.appointment_id,
                    a.appointment_date,
                    a.appointment_time,
                    a.reason,
                    a.status,
                    d.first_name as doctor_firstname,
                    d.last_name as doctor_lastname,
                    d.specialisation
                FROM appointment a
                    JOIN doctors d ON d.doctor_id = a.doctor_id
                WHERE a.patient_id = ?
                ORDER BY a.appointment_date DESC, a.appointment_time DESC`;

    db.query(sql, [patient_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.send(result);
    });
});

router.get('/doctor', (req, res) => {
    const doctor_id = authenticate(req, res);
    if (!doctor_id) return;

    const sql = `SELECT
                    a.appointment_id,
                    a.appointment_date,
                    a.appointment_time,
                    a.reason,
                    a.status,
                    p.first_name,
                    p.last_name,
                    p.email,
                    p.phone_no
                FROM appointment a
                    JOIN patient p ON p.patient_id = a.patient_id
                WHERE a.doctor_id = ?
                ORDER BY a.appointment_date DESC, a.appointment_time DESC`;

    db.query(sql, [doctor_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.send(result);
    });
});

router.get('/all', apiLimiter, (req, res) => {
    const sql = `SELECT
                    a.appointment_id,
                    a.appointment_date,
                    a.appointment_time,
                    a.reason,
                    a.status,
                    p.first_name,
                    p.last_name,
                    d.first_name as doctor_firstname,
                    d.last_name as doctor_lastname
                FROM appointment a
                    JOIN patient p ON p.patient_id = a.patient_id
                    JOIN doctors d ON d.doctor_id = a.doctor_id
                ORDER BY a.appointment_date DESC, a.appointment_time DESC`;

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.send(result);
    });
});

const VALID_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

router.post('/update', apiLimiter, (req, res) => {
    const { appointment_id, status } = req.body;

    if (!appointment_id) {
        return res.status(400).json({ error: 'Please provide an appointment id' });
    }
    if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: 'Invalid appointment status' });
    }

    const sql = `UPDATE appointment SET status = ? WHERE appointment_id = ?`;

    db.query(sql, [status, appointment_id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json({ message: 'Appointment updated' });
    });
});

module.exports = router;
