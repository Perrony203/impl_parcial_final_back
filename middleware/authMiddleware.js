'use strict';
const jwt = require('jsonwebtoken');
const { User } = require('../models');


// Helper to wrap async handlers and forward errors
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

const authenticateJWT = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Missing or invalid Authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        // Optionally fetch fresh user (ensures not deleted/role changed)
        const user = await User.findByPk(payload.id);
        if (!user) return res.status(401).json({ message: 'User no longer exists' });
        req.user = { id: user.id, role: user.role, username: user.username, email: user.email };
        next();
    } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
    }
});


const authorizeRoles = (...roles) => (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient role' });
    }
    next();
};


module.exports = { authenticateJWT, authorizeRoles, asyncHandler };