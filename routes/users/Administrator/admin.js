const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const admin = express.Router();

const db = require('../../../utils/db');
const { signToken, requireRole } = require('../../../utils/auth');
const { authLimiter, apiLimiter } = require('../../../utils/rateLimiters');
const { logActivity } = require('../../../utils/activityLog');

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

    // Only allow open registration when no admin exists yet (first-boot bootstrap).
    // Afterwards, creating employees requires an authenticated admin.
    db.query(`SELECT COUNT(*) AS count FROM admin`, (errCount, countRes) => {
        if (errCount) {
            console.log(errCount);
            return res.status(500).json({ error: 'Server error' });
        }

        const isFirstAdmin = Number(countRes[0].count) === 0;

        if (!isFirstAdmin) {
            const header = req.headers['authorization'];
            try {
                const payload = jwt.verify(header, process.env.SECRET_KEY, { algorithms: ['HS256'] });
                if (payload.role !== 'admin') {
                    return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
                }
            } catch (err) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
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

                        db.query(find, [email], (err3, result3) => {
                            if (err3) {
                                console.log(err3);
                                return res.status(500).json({ error: 'Server error' });
                            }
                            const admin_id = result3[0].admin_id;
                            logActivity('admin', admin_id, 'Employee account created', `${first_name} ${last_name} (${designation})`);
                            res.status(201).json({ message: 'Employee registered successfully' });
                        });
                    });
                });
            } else {
                res.status(409).json({ error: 'admin already exist...' });
            }
        });
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
                logActivity('admin', result[0].admin_id, 'Employee logged in');
                res.json({ token: signToken(result[0].admin_id, 'admin') });
            } else {
                res.status(401).json({ error: 'Password incorrect' });
            }
        } else {
            res.status(404).json({ error: 'Email not found' });
        }
    });
});

admin.get('/details', requireRole('admin'), (req, res) => {
    const admin_id = req.user.id;

    const sql = `SELECT admin_id, first_name, last_name, email, phone_no, designation, salary, address
                FROM admin WHERE admin_id = ?`;
    db.query(sql, [admin_id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.send(result);
    });
});

// Staff update their own non-identity details (email, salary and password are not self-service).
admin.patch('/update', requireRole('admin'), (req, res) => {
    const admin_id = req.user.id;
    const { first_name, last_name, address, phone_no, designation } = req.body;

    if (!first_name && !last_name && !address && !phone_no && !designation) {
        return res.status(400).json({ error: 'Please provide at least one field to update' });
    }
    if (first_name !== undefined && !String(first_name).trim()) {
        return res.status(400).json({ error: 'First name cannot be empty' });
    }
    if (last_name !== undefined && !String(last_name).trim()) {
        return res.status(400).json({ error: 'Last name cannot be empty' });
    }

    const update = `UPDATE admin SET
                        first_name = COALESCE(?, first_name),
                        last_name = COALESCE(?, last_name),
                        address = COALESCE(?, address),
                        phone_no = COALESCE(?, phone_no),
                        designation = COALESCE(?, designation)
                    WHERE admin_id = ?`;

    db.query(update, [first_name, last_name, address, phone_no, designation, admin_id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        logActivity('admin', admin_id, 'Profile updated');
        res.json({ message: 'Profile updated successfully' });
    });
});

// Change the password of the currently authenticated employee.
admin.post('/change_password', requireRole('admin'), authLimiter, (req, res) => {
    const admin_id = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
        return res.status(400).json({ error: 'Please provide your current and new password' });
    }
    if (String(new_password).length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters long' });
    }

    const find = `SELECT password FROM admin WHERE admin_id = ?`;

    db.query(find, [admin_id], (err, result) => {
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
            db.query(`UPDATE admin SET password = ? WHERE admin_id = ?`, [hash, admin_id], (err2) => {
                if (err2) {
                    console.log(err2);
                    return res.status(500).json({ error: 'Server error' });
                }
                logActivity('admin', admin_id, 'Password changed');
                res.json({ message: 'Password changed successfully' });
            });
        });
    });
});

// Update any employee's salary (admin only).
admin.post('/update_sal', requireRole('admin'), apiLimiter, (req, res) => {
    const { admin_id, salary } = req.body;

    if (!admin_id || salary === undefined || isNaN(Number(salary)) || Number(salary) < 0) {
        return res.status(400).json({ error: 'Please provide a valid admin id and non-negative numeric salary' });
    }

    db.query(`SELECT admin_id FROM admin WHERE admin_id = ?`, [admin_id], (err1, result1) => {
        if (err1) {
            console.log(err1);
            return res.status(500).json({ error: 'Server error' });
        }

        if (result1[0] === undefined) {
            return res.status(404).json({ error: 'Admin not found' });
        }

        db.query(`UPDATE admin SET salary = ? WHERE admin_id = ?`, [salary, admin_id], (err2) => {
            if (err2) {
                console.log(err2);
                return res.status(500).json({ error: 'Server error' });
            }
            logActivity('admin', req.user.id, 'Employee salary updated', `admin id ${admin_id} -> ${salary}`);
            res.json({ message: 'UPDATED' });
        });
    });
});

// Activity log for administrators.
admin.get('/logs', requireRole('admin'), (req, res) => {
    const { user_type, limit } = req.query;
    const parsed = parseInt(limit, 10);
    const max = Math.min(Math.max(Number.isNaN(parsed) ? 200 : parsed, 1), 500);

    let sql = `SELECT
                    l.log_id,
                    l.user_type,
                    l.user_id,
                    l.action,
                    l.details,
                    l.created_at,
                    COALESCE(p.first_name, d.first_name, a.first_name) AS first_name,
                    COALESCE(p.last_name, d.last_name, a.last_name) AS last_name
                FROM activity_log l
                    LEFT JOIN patient p ON l.user_type = 'patient' AND p.patient_id = l.user_id
                    LEFT JOIN doctors d ON l.user_type = 'doctor' AND d.doctor_id = l.user_id
                    LEFT JOIN admin a ON l.user_type = 'admin' AND a.admin_id = l.user_id`;
    const params = [];

    if (user_type && ['patient', 'doctor', 'admin'].includes(user_type)) {
        sql += ` WHERE l.user_type = ?`;
        params.push(user_type);
    }

    sql += ` ORDER BY l.created_at DESC, l.log_id DESC LIMIT ?`;
    params.push(max);

    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        res.json(result);
    });
});

admin.post('/delete', requireRole('admin'), apiLimiter, (req, res) => {
    const { admin_id } = req.body;

    if (!admin_id || !Number.isInteger(Number(admin_id)) || Number(admin_id) <= 0) {
        return res.status(400).json({ error: 'Please provide a valid admin id' });
    }

    if (Number(admin_id) === Number(req.user.id)) {
        return res.status(400).json({ error: 'You cannot delete your own account' });
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
                logActivity('admin', req.user.id, 'Employee deleted', `admin id ${admin_id}`);
                res.json({ message: 'DELETED' });
            });
        } else {
            res.status(404).json({ error: 'Admin not found' });
        }
    });
});

admin.post('/assign_doctor', requireRole('admin'), apiLimiter, (req, res) => {
    const { patient_id, doctor_id } = req.body;

    if (!patient_id || !doctor_id ||
        !Number.isInteger(Number(patient_id)) || Number(patient_id) <= 0 ||
        !Number.isInteger(Number(doctor_id)) || Number(doctor_id) <= 0) {
        return res.status(400).json({ error: 'Please provide valid patient id and doctor id' });
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
                logActivity('admin', req.user.id, 'Doctor assigned', `patient ${patient_id} -> doctor ${doctor_id}`);
                res.status(201).json({ message: 'Doctor assigned successfully' });
            });
        } else {
            res.status(409).json({ error: 'already exist...' });
        }
    });
});

admin.post('/remove_assign', requireRole('admin'), apiLimiter, (req, res) => {
    const { patient_id } = req.body;

    if (!patient_id || !Number.isInteger(Number(patient_id)) || Number(patient_id) <= 0) {
        return res.status(400).json({ error: 'Please provide a valid patient id' });
    }

    db.query(`DELETE FROM assign_doctor WHERE patient_id = ?`, [patient_id], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Server error' });
        }
        logActivity('admin', req.user.id, 'Doctor unassigned', `patient ${patient_id}`);
        res.json({ message: 'Assignment removed' });
    });
});

admin.post('/bill', requireRole('admin'), apiLimiter, (req, res) => {
    const { patient_email, medicine_cost, room_charge, misc_charge, operation_charge } = req.body;

    if (!patient_email || !isValidEmail(patient_email)) {
        return res.status(400).json({ error: 'Please provide a valid patient email' });
    }

    const charges = [medicine_cost, room_charge, misc_charge, operation_charge];
    if (charges.some(c => c === undefined || c === '' || isNaN(Number(c)) || Number(c) < 0)) {
        return res.status(400).json({ error: 'All charge fields must be non-negative numbers' });
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
                logActivity('admin', req.user.id, 'Bill updated', `patient ${patient_email}`);
                res.json({ message: 'Bill updated successfully' });
            });
        } else {
            res.status(404).json({ error: 'Patient not found' });
        }
    });
});

module.exports = admin;
