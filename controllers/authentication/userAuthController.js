'use strict';
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../../models');
const { asyncHandler } = require('../../middleware/authMiddleware')


const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';


const signToken = (user) => jwt.sign({id: user.id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    {expiresIn: JWT_EXPIRES_IN,}
);


// POST /auth/login
const login = asyncHandler(async (req, res) => {

    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'email and password are required' });
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);

    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = signToken(user);

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});


// POST /auth/daemons (SuperAdmin creates a daemon account)
const createDaemon = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'username, email, password are required' });
    }

    const exists = await User.findOne({ where: { email } });

    if (exists) return res.status(409).json({ message: 'Email already in use' });
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const daemon = await User.create({ name, email, password: hash, role: 'daemon' });

    res.status(201).json({ id: daemon.id, name: daemon.name, email: daemon.email, role: daemon.role });
});


// GET /auth/me
const me = asyncHandler(async (req, res) => {
    res.json({ user: req.user });
});


module.exports = { login, createDaemon, me };