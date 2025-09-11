'use strict';
const { Victim } = require('../../models');
const { asyncHandler } = require('../../middleware/authMiddleware');

// GET /victims → lista con paginación
const listVictims = asyncHandler(async (req, res) => {
  const page = Math.max(parseInt(req.query.page || '1', 10), 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
  const offset = (page - 1) * limit;

  const { rows, count } = await Victim.findAndCountAll({
    attributes: ['id', 'name', 'dangerLevel', 'createdAt'],
    offset,
    limit,
    order: [['id', 'DESC']],
  });

  res.json({ page, limit, total: count, data: rows });
});

// GET /victims/:id → detalle
const getVictim = asyncHandler(async (req, res) => {
  const victim = await Victim.findByPk(req.params.id, {
    attributes: ['id', 'name', 'dangerLevel', 'createdAt'],
  });

  if (!victim) return res.status(404).json({ message: 'Not found' });

  res.json(victim);
});

// POST /victims → crear víctima (daemon o superadmin)
const createVictim = asyncHandler(async (req, res) => {
  const { name, dangerLevel } = req.body || {};

  if (!name || !dangerLevel) {
    return res.status(400).json({ message: 'Name and dangerLevel are required' });
  }

  const victim = await Victim.create({ name, dangerLevel });
  res.status(201).json(victim);
});

// PATCH /victims/:id → actualizar víctima (solo superadmin)
const updateVictim = asyncHandler(async (req, res) => {
  const victim = await Victim.findByPk(req.params.id);
  if (!victim) return res.status(404).json({ message: 'Not found' });

  const { name, dangerLevel } = req.body || {};
  await victim.update({
    ...(name !== undefined ? { name } : {}),
    ...(dangerLevel !== undefined ? { dangerLevel } : {}),
  });

  res.json({ id: victim.id, name: victim.name, dangerLevel: victim.dangerLevel });
});

// DELETE /victims/:id → eliminar víctima (solo superadmin)
const removeVictim = asyncHandler(async (req, res) => {
  const deleted = await Victim.destroy({ where: { id: req.params.id } });
  if (!deleted) return res.status(404).json({ message: 'Not found' });

  res.status(204).send();
});

module.exports = { listVictims, getVictim, createVictim, updateVictim, removeVictim };
