'use strict';
const { User } = require('../../models');
const { asyncHandler } = require('../../middleware/authMiddleware');


// GET /users (superadmin)
const listUsers = asyncHandler(async (req, res) => {

    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const offset = (page - 1) * limit;

    const { rows, count } = await User.findAndCountAll({
        attributes: ['id', 'username', 'email', 'role', 'createdAt'],
        offset,
        limit,
        order: [['id', 'DESC']],
    });

    res.json({ page, limit, total: count, data: rows });
});


// GET /users/:id (superadmin)
const getUser = asyncHandler(async (req, res) => {

    const user = await User.findByPk(req.params.id, { attributes: ['id', 'username', 'email', 'role', 'createdAt'] });
    if (!user) return res.status(404).json({ message: 'Not found' });

    res.json(user);
});


// PATCH /users/:id (superadmin) – update username/email/role (not password)
const updateUser = asyncHandler(async (req, res) => {

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'Not found' });

    const { username, email, role } = req.body || {};
    await user.update({
        ...(username !== undefined ? { username } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(role !== undefined ? { role } : {}),
    });

    res.json({ id: user.id, username: user.username, email: user.email, role: user.role });
});


// DELETE /users/:id (superadmin)
const removeUser = asyncHandler(async (req, res) => {

    const deleted = await User.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Not found' });

    res.status(204).send();
});


module.exports = { listUsers, getUser, updateUser, removeUser };