'use strict';
const { ResistanceContent } = require('../../models');
const { asyncHandler } = require('../../middleware/authMiddleware');


// Public endpoints
// GET /content (public)
const listContent = asyncHandler(async (req, res) => {

    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const offset = (page - 1) * limit;

    const { rows, count } = await ResistanceContent.findAndCountAll({
        offset,
        limit,
        order: [['id', 'DESC']],
    });

    res.json({ page, limit, total: count, data: rows });
});


// GET /content/:id (public)
const getContent = asyncHandler(async (req, res) => {

    const item = await ResistanceContent.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });

    res.json(item);
});


// Admin endpoints
// POST /content (superadmin)
const createContent = asyncHandler(async (req, res) => {

    const { title, content, mediaUrl } = req.body || {};
    if (!title || !content) return res.status(400).json({ message: 'title and content are required' });
    const item = await ResistanceContent.create({ title, content, mediaUrl });

    res.status(201).json(item);
});


// PATCH /content/:id (superadmin)
const updateContent = asyncHandler(async (req, res) => {

    const item = await ResistanceContent.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    const { title, content, mediaUrl } = req.body || {};
    await item.update({
        ...(title !== undefined ? { title } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(mediaUrl !== undefined ? { mediaUrl } : {}),
    });

    res.json(item);
});


// DELETE /content/:id (superadmin)
const removeContent = asyncHandler(async (req, res) => {

    const deleted = await ResistanceContent.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Not found' });
    
    res.status(204).send();
});


module.exports = { listContent, getContent, createContent, updateContent, removeContent };