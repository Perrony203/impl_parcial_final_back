'use strict';
const { ResistanceAttempt, User } = require('../../models');
const { asyncHandler } = require('../../middleware/authMiddleware');
const { Op } = require('sequelize');


// GET /analytics/daemon/:id – summary
const daemonSummary = asyncHandler(async (req, res) => {

    const daemonId = parseInt(req.params.id, 10);
    if (req.user.role === 'daemon' && req.user.id !== daemonId) {
    return res.status(403).json({ message: 'Forbidden' });
    }

    const [total, pending, inProgress, resolved, rejected] = await Promise.all([
        ResistanceAttempt.count({ where: { createdBy: daemonId } }),
        ResistanceAttempt.count({ where: { createdBy: daemonId, state: 'Pending' } }),
        ResistanceAttempt.count({ where: { createdBy: daemonId, state: 'In_progress' } }),
        ResistanceAttempt.count({ where: { createdBy: daemonId, state: 'Resolved' } }),
        ResistanceAttempt.count({ where: { createdBy: daemonId, state: 'Rejected' } }),
    ]);

    res.json({ daemonId, totals: { total, pending, inProgress, resolved, rejected } });
});


// GET /analytics/leaderboard?limit=10 – top daemons by number of attempts
const leaderboard = asyncHandler(async (req, res) => {

    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 50);

    const rows = await ResistanceAttempt.findAll({
        attributes: ['createdBy', [require('sequelize').fn('COUNT', require('sequelize').col('createdBy')), 'count']],
        group: ['createdBy'],
        order: [[require('sequelize').literal('count'), 'DESC']],
        limit,
        include: [{ model: User, as: 'daemon', attributes: ['id', 'username'] }],
    });
    
    res.json(rows);
});


module.exports = { daemonSummary, leaderboard };