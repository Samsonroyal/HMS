const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const db = require('../../../utils/db');

process.env.SECRET_KEY = 'Arijit';

router.post('/create', (req, res) => {
    const doctor_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

    const data = {
        patient_id: req.body.patient_id,
        medicine_name: req.body.medicine_name,
        dosage: req.body.dosage,
        instructions: req.body.instructions
    };

    const date = new Date().toISOString().slice(0, 10);

    const sql = `INSERT INTO prescription (patient_id, doctor_id, medicine_name, dosage, instructions, date)
                 VALUES (?, ?, ?, ?, ?, ?)`;

    db.query(sql, [data.patient_id, doctor_id, data.medicine_name, data.dosage, data.instructions, date], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send('Could not save prescription');
        }
        res.send('Prescription saved');
    });
});

router.get('/patient', (req, res) => {
    const patient_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

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
            return res.status(500).send(err);
        }
        res.send(result);
    });
});

router.get('/doctor', (req, res) => {
    const doctor_id = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);

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
            return res.status(500).send(err);
        }
        res.send(result);
    });
});

module.exports = router;
