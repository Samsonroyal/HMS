const jwt = require('jsonwebtoken');

function authenticate(req, res) {
    try {
        return jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    } catch (err) {
        res.status(401).json({ error: 'Unauthorized' });
        return null;
    }
}

function signToken(id) {
    return jwt.sign(String(id), process.env.SECRET_KEY, { expiresIn: '1d' });
}

module.exports = { authenticate, signToken };
