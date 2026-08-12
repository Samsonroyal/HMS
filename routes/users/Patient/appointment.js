const express = require('express');

const router = express.Router();

const db = require('../../../utils/db');
const { requireRole } = require('../../../utils/auth');
const { apiLimiter } = require('../../../utils/rateLimiters');
const { logActivity } = require('../../../utils/activityLog');

router.post('/book', requireRole('patient'), apiLimiter, (req, res) => {
    const patient_id = req.user.id;

    const { doctor_id, appointment_date, appointment_time, reason } = req.body;

    if (!doctor_id || !appointment_date || !appointment_time) {
        return res.status(400).json({ error: 'Please select a doctor, date and time' });
    }
    if (!Number.isInteger(Number(doctor_id)) || Number(doctor_id) <= 0) {
        return res.status(400).json({ error: 'Please provide a valid doctor id' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(appointment_date))) {
        return res.status(400).json({ error: 'Please provide a valid appointment date (YYYY-MM-DD)' });
    }
    if (!/^\d{2}:\d{2}(:\d{2})?$/.test(String(appointment_time))) {
        return res.status(400).json({ error: 'Please provide a valid appointment time (HH:MM)' });
    }

    db.query(`SELECT doctor_id FROM doctors WHERE doctor_id = ?`, [doctor_id], (errCheck, resultCheck) => {
        if (errCheck) {
            console.log(errCheck);
            return res.status(500).json({ error: 'Server error' });
        }
        if (resultCheck[0] === undefined) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        const create = `INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, reason, status)
                        VALUES (?, ?, ?, ?, ?, 'pending')`;

        db.query(create, [patient_id, doctor_id, appointment_date, appointment_time, reason], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Could not book appointment' });
            }
            logActivity('patient', patient_id, 'Appointment booked', `doctor ${doctor_id} on ${appointment_date}`);
            res.status(201).json({ message: 'Appointment booked successfully' });
        });
    });
});

router.get('/patient', requireRole('patient'), (req, res) => {
    const patient_id = req.user.id;

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

router.get('/doctor', requireRole('doctor'), (req, res) => {
    const doctor_id = req.user.id;

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

router.get('/all', requireRole('admin'), apiLimiter, (req, res) => {
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

router.post('/update', requireRole('doctor', 'admin'), apiLimiter, (req, res) => {
    const { appointment_id, status } = req.body;

    if (!appointment_id || !Number.isInteger(Number(appointment_id)) || Number(appointment_id) <= 0) {
        return res.status(400).json({ error: 'Please provide a valid appointment id' });
    }
    if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ error: 'Invalid appointment status' });
    }

    const find = `SELECT doctor_id FROM appointment WHERE appointment_id = ?`;

    db.query(find, [appointment_id], (err1, result1) => {
        if (err1) {
            console.log(err1);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result1[0] === undefined) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        // Doctors can only update their own appointments; admins can update any.
        if (req.user.role === 'doctor' && result1[0].doctor_id !== Number(req.user.id)) {
            return res.status(403).json({ error: 'You can only update your own appointments' });
        }

        const sql = `UPDATE appointment SET status = ? WHERE appointment_id = ?`;

        db.query(sql, [status, appointment_id], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Server error' });
            }
            logActivity(req.user.role, req.user.id, 'Appointment status updated', `appointment ${appointment_id} -> ${status}`);
            res.json({ message: 'Appointment updated' });
        });
    });
});

router.post('/delete', requireRole('patient', 'doctor', 'admin'), apiLimiter, (req, res) => {
    const { appointment_id } = req.body;

    if (!appointment_id || !Number.isInteger(Number(appointment_id)) || Number(appointment_id) <= 0) {
        return res.status(400).json({ error: 'Please provide a valid appointment id' });
    }

    const find = `SELECT patient_id, doctor_id FROM appointment WHERE appointment_id = ?`;

    db.query(find, [appointment_id], (err1, result1) => {
        if (err1) {
            console.log(err1);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result1[0] === undefined) {
            return res.status(404).json({ error: 'Appointment not found' });
        }

        const { role, id } = req.user;
        const owned =
            role === 'admin' ||
            (role === 'patient' && result1[0].patient_id === Number(id)) ||
            (role === 'doctor' && result1[0].doctor_id === Number(id));

        if (!owned) {
            return res.status(403).json({ error: 'You can only delete your own appointments' });
        }

        db.query(`DELETE FROM appointment WHERE appointment_id = ?`, [appointment_id], (err2) => {
            if (err2) {
                console.log(err2);
                return res.status(500).json({ error: 'Server error' });
            }
            logActivity(role, id, 'Appointment deleted', `appointment ${appointment_id}`);
            res.json({ message: 'Appointment deleted' });
        });
    });
});

module.exports = router;
