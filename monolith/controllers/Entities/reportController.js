'use strict';
const { Report } = require('../../models');
const { asyncHandler } = require('../../middleware/authMiddleware');


// POST /reports (public/anonymous)
const createAnonymousReport = asyncHandler(async (req, res) => {

    const { title, content } = req.body || {};

    if (!title || !content) return res.status(400).json({ message: 'title and content are required' });
    const report = await Report.create({ title, content });

    res.status(201).json({ id: report.id, title: report.title, content: report.content, createdAt: report.createdAt });
});


// GET /reports (admin only – list all anonymous reports) with pagination
const listReports = asyncHandler(async (req, res) => {

    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const offset = (page - 1) * limit;

    const { rows, count } = await Report.findAndCountAll({
        offset,
        limit,
        order: [['id', 'DESC']],
    });

    res.json({ page, limit, total: count, data: rows });
});


// DELETE /reports/:id (admin only)
const removeReport = asyncHandler(async (req, res) => {

    const { id } = req.params;
    const deleted = await Report.destroy({ where: { id } });

    if (!deleted) return res.status(404).json({ message: 'Report not found' });
    
    res.status(204).send();
});


module.exports = { createAnonymousReport, listReports, removeReport };