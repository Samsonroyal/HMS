const express = require('express');

const router = express.Router();

const db = require('../../../utils/db');
const { requireRole } = require('../../../utils/auth');
const { apiLimiter } = require('../../../utils/rateLimiters');
const { logActivity } = require('../../../utils/activityLog');

router.post('/create', requireRole('doctor'), apiLimiter, (req, res) => {
    const doctor_id = req.user.id;

    const { patient_id, medicine_name, dosage, instructions } = req.body;

    if (!patient_id || !medicine_name) {
        return res.status(400).json({ error: 'Please select a patient and provide a medicine name' });
    }
    if (!Number.isInteger(Number(patient_id)) || Number(patient_id) <= 0) {
        return res.status(400).json({ error: 'Please provide a valid patient id' });
    }

    // Only write prescriptions for patients assigned to this doctor.
    db.query(`SELECT assign_id FROM assign_doctor WHERE doctor_id = ? AND patient_id = ?`, [doctor_id, patient_id], (errAssign, resultAssign) => {
        if (errAssign) {
            console.log(errAssign);
            return res.status(500).json({ error: 'Server error' });
        }

        if (resultAssign[0] === undefined) {
            return res.status(403).json({ error: 'This patient is not assigned to you' });
        }

        const date = new Date();
        const localDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        const sql = `INSERT INTO prescription (patient_id, doctor_id, medicine_name, dosage, instructions, date)
                     VALUES (?, ?, ?, ?, ?, ?)`;

        db.query(sql, [patient_id, doctor_id, medicine_name, dosage, instructions, localDate], (err) => {
            if (err) {
                console.log(err);
                return res.status(500).json({ error: 'Could not save prescription' });
            }
            logActivity('doctor', doctor_id, 'Prescription written', `patient ${patient_id}: ${medicine_name}`);
            res.status(201).json({ message: 'Prescription saved successfully' });
        });
    });
});

router.get('/patient', requireRole('patient'), (req, res) => {
    const patient_id = req.user.id;

    const sql = `SELECT
                    pr.prescription_id,
                    pr.medicine_name,
                    pr.dosage,
                    pr.instructions,
                    pr.date,
                    d.first_name as doctor_firstname,
                    d.last_name as doctor_lastname,
                    d.specialisation
                FROM prescription pr
                    JOIN doctors d ON d.doctor_id = pr.doctor_id
                WHERE pr.patient_id = ?
                ORDER BY pr.date DESC`;

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
                    pr.prescription_id,
                    pr.medicine_name,
                    pr.dosage,
                    pr.instructions,
                    pr.date,
                    p.first_name,
                    p.last_name
                FROM prescription pr
                    JOIN patient p ON p.patient_id = pr.patient_id
                WHERE pr.doctor_id = ?
                ORDER BY pr.date DESC`;

    db.query(sql, [doctor_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.send(result);
    });
});

router.post('/delete', requireRole('doctor', 'admin'), apiLimiter, (req, res) => {
    const { prescription_id } = req.body;

    if (!prescription_id || !Number.isInteger(Number(prescription_id)) || Number(prescription_id) <= 0) {
        return res.status(400).json({ error: 'Please provide a valid prescription id' });
    }

    const find = `SELECT doctor_id FROM prescription WHERE prescription_id = ?`;

    db.query(find, [prescription_id], (err1, result1) => {
        if (err1) {
            console.log(err1);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result1[0] === undefined) {
            return res.status(404).json({ error: 'Prescription not found' });
        }

        const { role, id } = req.user;
        const owned = role === 'admin' || result1[0].doctor_id === Number(id);

        if (!owned) {
            return res.status(403).json({ error: 'You can only delete your own prescriptions' });
        }

        db.query(`DELETE FROM prescription WHERE prescription_id = ?`, [prescription_id], (err2) => {
            if (err2) {
                console.log(err2);
                return res.status(500).json({ error: 'Server error' });
            }
            logActivity(role, id, 'Prescription deleted', `prescription ${prescription_id}`);
            res.json({ message: 'Prescription deleted' });
        });
    });
});

module.exports = router;
