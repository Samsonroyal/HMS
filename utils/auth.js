const jwt = require('jsonwebtoken');

function authenticate(req, res) {
    try {
        return jwt.verify(req.headers['authorization'], process.env.SECRET_KEY, { algorithms: ['HS256'] });
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
        return null;
    }
}

function signToken(id, role) {
    return jwt.sign({ id: String(id), role }, process.env.SECRET_KEY, { expiresIn: '1d' });
}

// Middleware factory: require an authenticated user whose role is in the allowed list.
function requireRole(...roles) {
    return (req, res, next) => {
        const payload = authenticate(req, res);
        if (!payload) return;
        if (!roles.includes(payload.role)) {
            return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
        }
        req.user = payload;
        next();
    };
}

module.exports = { authenticate, signToken, requireRole };
