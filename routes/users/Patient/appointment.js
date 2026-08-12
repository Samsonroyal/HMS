const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const db = require('../../../utils/db');

process.env.SECRET_KEY = 'Arijit';

router.post('/book', (req, res) => {
    const patient_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

    const data = {
        doctor_id: req.body.doctor_id,
        appointment_date: req.body.appointment_date,
        appointment_time: req.body.appointment_time,
        reason: req.body.reason
    };

    const create = `INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
                    VALUES (?, ?, ?, ?, ?, 'pending')`;

    db.query(create, [patient_id, data.doctor_id, data.appointment_date, data.appointment_time, data.reason], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Could not book appointment');
        }
        res.send('Appointment booked');
    });
});

router.get('/patient', (req, res) => {
    const patient_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

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
            return res.status(500).send(err);
        }
        res.send(result);
    });
});

router.get('/doctor', (req, res) => {
    const doctor_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

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
            return res.status(500).send(err);
        }
        res.send(result);
    });
});

router.get('/all', (req, res) => {
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
            return res.status(500).send(err);
        }
        res.send(result);
    });
});

router.post('/update', (req, res) => {
    const data = {
        appointment_id: req.body.appointment_id,
        status: req.body.status
    };

    const sql = `UPDATE appointment SET status = ? WHERE appointment_id = ?`;

    db.query(sql, [data.status, data.appointment_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send(err);
        }
        res.send('Updated');
    });
});

module.exports = router;
