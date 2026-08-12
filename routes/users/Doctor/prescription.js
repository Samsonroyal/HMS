const express = require('express');

const router = express.Router();

const db = require('../../../utils/db');
const { authenticate } = require('../../../utils/auth');

router.post('/create', (req, res) => {
    const doctor_id = authenticate(req, res);
    if (!doctor_id) return;

    const { patient_id, medicine_name, dosage, instructions } = req.body;

    if (!patient_id || !medicine_name) {
        return res.status(400).json({ error: 'Please select a patient and provide a medicine name' });
    }

    const date = new Date().toISOString().slice(0, 10);

    const sql = `INSERT INTO prescription (patient_id, doctor_id, medicine_name, dosage, instructions, date)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [patient_id, doctor_id, medicine_name, dosage, instructions, date], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Could not save prescription' });
        }
        res.status(201).json({ message: 'Prescription saved successfully' });
    });
});

router.get('/patient', (req, res) => {
    const patient_id = authenticate(req, res);
    if (!patient_id) return;

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

router.get('/doctor', (req, res) => {
    const doctor_id = authenticate(req, res);
    if (!doctor_id) return;

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

module.exports = router;
