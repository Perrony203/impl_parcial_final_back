'use strict';
const { RewardPunishment, User } = require('../../models');
const { asyncHandler } = require('../../middleware/authMiddleware');

// POST /rewards (superadmin)
const createRewardPunishment = asyncHandler(async (req, res) => {

    const { daemonId, type, description } = req.body || {};
    if (!daemonId || !type || !description) {
        return res.status(400).json({ message: 'daemonId, type, description are required' });
    }

    const daemon = await User.findByPk(daemonId);
    if (!daemon || daemon.role !== 'daemon') return res.status(400).json({ message: 'daemonId is invalid' });
    const item = await RewardPunishment.create({ daemon: daemonId, type, description });

    res.status(201).json(item);
});

// GET /rewards (superadmin list all) or /rewards/my (daemon list own)
const listAll = asyncHandler(async (req, res) => {

    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const offset = (page - 1) * limit;

    const { rows, count } = await RewardPunishment.findAndCountAll({
        offset,
        limit,
        order: [['id', 'DESC']],
        include: [{ model: User, as: 'assignedDaemon', attributes: ['id', 'name', 'email'] }],
    });

    res.json({ page, limit, total: count, data: rows });
});

const listMine = asyncHandler(async (req, res) => {
    
    const items = await RewardPunishment.findAll({
        where: { daemon: req.user.id },
        order: [['id', 'DESC']],
    });

    res.json(items);
});

const getForDaemon = asyncHandler(async (req, res) => {
  const history = await RewardPunishment.findByPk(req.params.id, {
    attributes: ['id', 'type', 'description', 'createdAt'],
  });

  if (!history) return res.status(404).json({ message: 'Not found' });

  res.json(history);
});


module.exports = { createRewardPunishment, listAll, listMine, getForDaemon };