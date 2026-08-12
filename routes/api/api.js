const express = require('express');

const api = express.Router();

const db = require('../../utils/db');
const { requireRole } = require('../../utils/auth');
const { apiLimiter } = require('../../utils/rateLimiters');

// Doctors list for the patient appointment booking form (requires a patient token).
api.get('/doctors', requireRole('patient'), apiLimiter, (req, res) => {
    const sql = "SELECT doctor_id, first_name, last_name, email, specialisation FROM doctors";

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json(result);
    });
});

module.exports = api;
