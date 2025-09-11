'use strict';
const { ResistanceAttempt, User } = require('../../models');
const { asyncHandler } = require('../../middleware/authMiddleware');

// POST /resistance-attempts (daemon)
const createAttempt = asyncHandler(async (req, res) => {

    const { title, content, victimName } = req.body || {};

    if (!title || !content || !victimName) {
        return res.status(400).json({ message: 'title, content and victimName are required' });
    }

    const attempt = await ResistanceAttempt.create({ title, content, victimName, createdBy: req.user.id });

    res.status(201).json(attempt);
});


// GET /resistance-attempts (daemon: only own; superadmin: all) – filters & pagination
const listAttempts = asyncHandler(async (req, res) => {

    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const offset = (page - 1) * limit;
    const { state, q } = req.query;

    const where = {};
    if (state) where.state = state; // must be one of ENUM values
    if (req.user.role === 'daemon') where.createdBy = req.user.id; // scope to own
    if (q) {    
        where[require('sequelize').Op.or] = [
        { title: { [require('sequelize').Op.iLike]: `%${q}%` } },
        { content: { [require('sequelize').Op.iLike]: `%${q}%` } },
        ];
    }

    const { rows, count } = await ResistanceAttempt.findAndCountAll({
        where,
        include: [{ model: User, as: 'daemon', attributes: ['id', 'name', 'email'] }],
        offset,
        limit,
        order: [['id', 'DESC']],
    });

    res.json({ page, limit, total: count, data: rows });
});


// GET /resistance-attempts/:id (owner or superadmin)
const getAttempt = asyncHandler(async (req, res) => {
    
    const attempt = await ResistanceAttempt.findByPk(req.params.id, {
        include: [{ model: User, as: 'daemon', attributes: ['id', 'name', 'email'] }, {model: Victim, as: 'victim', attributes: ['id', 'name', 'dangerLevel']}],
    });

    if (!attempt) return res.status(404).json({ message: 'Not found' });
    if (req.user.role === 'daemon' && attempt.createdBy !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    res.json(attempt);
});


// PATCH /resistance-attempts/:id (owner can edit own title/content/victimName; superadmin can also update state)
const updateAttempt = asyncHandler(async (req, res) => {

    const allowedForDaemon = ['title', 'content', 'victimName'];
    const allowedForAdmin = ['title', 'content', 'victimName', 'state'];

    const attempt = await ResistanceAttempt.findByPk(req.params.id);
    if (!attempt) return res.status(404).json({ message: 'Not found' });

    if (req.user.role === 'daemon' && attempt.createdBy !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    const payload = {};
    const keys = req.user.role === 'superadmin' ? allowedForAdmin : allowedForDaemon;
    keys.forEach((k) => {
        if (Object.prototype.hasOwnProperty.call(req.body, k)) payload[k] = req.body[k];
    });

    await attempt.update(payload);
    res.json(attempt);
});


// DELETE /resistance-attempts/:id (owner or superadmin)
const removeAttempt = asyncHandler(async (req, res) => {

    const attempt = await ResistanceAttempt.findByPk(req.params.id);
    if (!attempt) return res.status(404).json({ message: 'Not found' });

    if (req.user.role === 'daemon' && attempt.createdBy !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden' });
    }

    await attempt.destroy();
    res.status(204).send();
});

const getForVictim = asyncHandler(async (req, res) => {
  const history = await ResistanceAttempt.findByPk(req.params.id, {
    attributes: ['state', 'title', 'content', 'createdAt'],
    include: [{ model: User, as: 'daemon', attributes: ['id', 'name', 'email'] }, { model: Victim, as: 'victim', attributes: ['id', 'name', 'dangerLevel'] }]
  });

  if (!history) return res.status(404).json({ message: 'Not found' });

  res.json(history);
});


module.exports = { createAttempt, listAttempts, getAttempt, updateAttempt, removeAttempt, getForVictim };

