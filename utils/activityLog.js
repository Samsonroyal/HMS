const db = require('./db');

// Record a user action for the administrator activity log.
// userType: 'patient' | 'doctor' | 'admin'
function logActivity(userType, userId, action, details) {
    if (!userType || !userId || !action) return;
    db.query(
        'INSERT INTO activity_log (user_type, user_id, action, details) VALUES (?, ?, ?, ?)',
        [userType, userId, action, details || null],
        (err) => {
            if (err) console.log('Failed to log activity:', err);
        }
    );
}

module.exports = { logActivity };
