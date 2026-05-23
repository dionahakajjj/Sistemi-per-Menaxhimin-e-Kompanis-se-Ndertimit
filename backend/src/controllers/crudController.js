const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const models = require('../models');

// Configure our models and search/eager loading behaviors
const entityModelMap = {
  'users': {
    model: models.User,
    include: [],
    searchFields: ['username', 'email', 'role'],
    readRoles: ['Admin', 'Menaxher', 'Punëtor'],
    writeRoles: ['Admin'],
    deleteRoles: ['Admin']
  },
  'clients': {
    model: models.Client,
    include: [],
    searchFields: ['emri', 'kompania', 'email', 'telefoni', 'adresa', 'lloji_klientit'],
    readRoles: ['Admin', 'Menaxher', 'Punëtor'],
    writeRoles: ['Admin', 'Menaxher'],
    deleteRoles: ['Admin']
  },
  'projects': {
    model: models.Project,
    include: [{ model: models.Client, as: 'client', attributes: ['id', 'emri', 'kompania'] }],
    searchFields: ['emri', 'përshkrimi', 'lokacioni'],
    readRoles: ['Admin', 'Menaxher', 'Punëtor'],
    writeRoles: ['Admin', 'Menaxher'],
    deleteRoles: ['Admin']
  },
  'workers': {
    model: models.Worker,
    include: [],
    searchFields: ['emri', 'mbiemri', 'email', 'telefoni', 'profesioni', 'statusi'],
    readRoles: ['Admin', 'Menaxher', 'Punëtor'],
    writeRoles: ['Admin', 'Menaxher'],
    deleteRoles: ['Admin']
  },
  'project-phases': {
    model: models.ProjectPhase,
    include: [{ model: models.Project, as: 'project', attributes: ['id', 'emri'] }],
    searchFields: ['emri', 'përshkrimi', 'statusi'],
    readRoles: ['Admin', 'Menaxher', 'Punëtor'],
    writeRoles: ['Admin', 'Menaxher'],
    deleteRoles: ['Admin']
  },
  'tasks': {
    model: models.Task,
    include: [{ 
      model: models.ProjectPhase, 
      as: 'phase', 
      attributes: ['id', 'emri'],
      include: [{ model: models.Project, as: 'project', attributes: ['id', 'emri'] }]
    }],
    searchFields: ['emri', 'përshkrimi', 'prioriteti', 'statusi'],
    readRoles: ['Admin', 'Menaxher', 'Punëtor'],
    writeRoles: ['Admin', 'Menaxher'],
    deleteRoles: ['Admin']
  },
  'task-assignments': {
    model: models.TaskAssignment,
    include: [
      { model: models.Task, as: 'task', attributes: ['id', 'emri'] },
      { model: models.Worker, as: 'worker', attributes: ['id', 'emri', 'mbiemri'] }
    ],
    searchFields: [],
    readRoles: ['Admin', 'Menaxher', 'Punëtor'],
    writeRoles: ['Admin', 'Menaxher'],
    deleteRoles: ['Admin']
  },
  'suppliers': {
    model: models.Supplier,
    include: [],
    searchFields: ['emri', 'kontakti', 'email', 'telefoni', 'adresa', 'specialiteti'],
    readRoles: ['Admin', 'Menaxher', 'Punëtor'],
    writeRoles: ['Admin', 'Menaxher'],
    deleteRoles: ['Admin']
  },
  'materials': {
    model: models.Material,
    include: [{ model: models.Supplier, as: 'supplier', attributes: ['id', 'emri'] }],
    searchFields: ['emri', 'njësia_matëse', 'kategoria'],
    readRoles: ['Admin', 'Menaxher', 'Punëtor'],
    writeRoles: ['Admin', 'Menaxher'],
    deleteRoles: ['Admin']
  },
  'material-usages': {
    model: models.MaterialUsage,
    include: [
      { model: models.Project, as: 'project', attributes: ['id', 'emri'] },
      { model: models.Material, as: 'material', attributes: ['id', 'emri', 'njësia_matëse', 'çmimi_njesi'] },
      { model: models.ProjectPhase, as: 'phase', attributes: ['id', 'emri'] }
    ],
    searchFields: [],
    readRoles: ['Admin', 'Menaxher', 'Punëtor'],
    writeRoles: ['Admin', 'Menaxher'],
    deleteRoles: ['Admin']
  },
  'equipment': {
    model: models.Equipment,
    include: [],
    searchFields: ['emri', 'lloji', 'statusi'],
    readRoles: ['Admin', 'Menaxher', 'Punëtor'],
    writeRoles: ['Admin', 'Menaxher'],
    deleteRoles: ['Admin']
  },
  'invoices': {
    model: models.Invoice,
    include: [
      { model: models.Project, as: 'project', attributes: ['id', 'emri'] },
      { model: models.Client, as: 'client', attributes: ['id', 'emri', 'kompania'] }
    ],
    searchFields: ['përshkrimi', 'statusi'],
    readRoles: ['Admin', 'Menaxher', 'Punëtor'],
    writeRoles: ['Admin', 'Menaxher'],
    deleteRoles: ['Admin']
  }
};

const getEntityConfig = (entityName, res) => {
  const config = entityModelMap[entityName];
  if (!config) {
    res.status(404).json({ message: `Resursi '${entityName}' nuk ekziston.` });
    return null;
  }
  return config;
};

// Check user permissions dynamically
const checkPermission = (role, allowedRoles, res) => {
  if (!allowedRoles.includes(role)) {
    res.status(403).json({ message: 'Nuk keni privilegje për këtë veprim.' });
    return false;
  }
  return true;
};

// GET List
exports.list = async (req, res) => {
  const config = getEntityConfig(req.params.entity, res);
  if (!config) return;

  if (!checkPermission(req.user.role, config.readRoles, res)) return;

  try {
    const { q, page, limit, orderField, orderDir, ...filters } = req.query;

    const where = {};

    // 1. Search Query
    if (q && config.searchFields.length > 0) {
      where[Op.or] = config.searchFields.map(field => ({
        [field]: { [Op.like]: `%${q}%` }
      }));
    }

    // 2. Direct Filters (e.g. statusi=Aktiv, projekti_id=3)
    Object.keys(filters).forEach(key => {
      if (config.model.rawAttributes[key]) {
        where[key] = filters[key];
      }
    });

    // 3. Pagination
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 100; // default large limit to show items, override with page size
    const offset = (pageNum - 1) * limitNum;

    // 4. Ordering
    const order = [];
    if (orderField && config.model.rawAttributes[orderField]) {
      const dir = orderDir && orderDir.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
      order.push([orderField, dir]);
    } else {
      order.push(['id', 'DESC']); // default sorting newest first
    }

    const { count, rows } = await config.model.findAndCountAll({
      where,
      include: config.include,
      limit: limitNum,
      offset,
      order,
      distinct: true // prevents incorrect counting due to joins
    });

    res.json({
      data: rows,
      meta: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Gabim gjatë marrjes së të dhënave.', error: error.message });
  }
};

// GET Single
exports.getOne = async (req, res) => {
  const config = getEntityConfig(req.params.entity, res);
  if (!config) return;

  if (!checkPermission(req.user.role, config.readRoles, res)) return;

  try {
    const item = await config.model.findByPk(req.params.id, {
      include: config.include
    });

    if (!item) {
      return res.status(404).json({ message: 'Artikulli nuk u gjet.' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Gabim gjatë marrjes së artikullit.', error: error.message });
  }
};

// POST Create
exports.create = async (req, res) => {
  const config = getEntityConfig(req.params.entity, res);
  if (!config) return;

  if (!checkPermission(req.user.role, config.writeRoles, res)) return;

  try {
    const data = { ...req.body };

    // Special hashing for User passwords
    if (req.params.entity === 'users') {
      if (!data.password) {
        return res.status(400).json({ message: 'Fjalëkalimi është i detyrueshëm.' });
      }
      const salt = await bcrypt.genSalt(10);
      data.passwordHash = await bcrypt.hash(data.password, salt);
      delete data.password;
    }

    const newItem = await config.model.create(data);
    
    // Fetch newly created record with its associations for rich response
    const completeItem = await config.model.findByPk(newItem.id, {
      include: config.include
    });

    res.status(201).json({
      message: 'Artikulli u krijua me sukses.',
      data: completeItem
    });
  } catch (error) {
    res.status(400).json({ message: 'Gabim gjatë krijimit të artikullit.', error: error.message });
  }
};

// PUT Update
exports.update = async (req, res) => {
  const config = getEntityConfig(req.params.entity, res);
  if (!config) return;

  if (!checkPermission(req.user.role, config.writeRoles, res)) return;

  try {
    const item = await config.model.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Artikulli nuk u gjet.' });
    }

    const data = { ...req.body };

    // Special hashing for User password updates
    if (req.params.entity === 'users') {
      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.passwordHash = await bcrypt.hash(data.password, salt);
      }
      delete data.password;
    }

    await item.update(data);

    // Fetch updated record with its associations
    const completeItem = await config.model.findByPk(item.id, {
      include: config.include
    });

    res.json({
      message: 'Artikulli u përditësua me sukses.',
      data: completeItem
    });
  } catch (error) {
    res.status(400).json({ message: 'Gabim gjatë përditësimit të artikullit.', error: error.message });
  }
};

// DELETE
exports.delete = async (req, res) => {
  const config = getEntityConfig(req.params.entity, res);
  if (!config) return;

  if (!checkPermission(req.user.role, config.deleteRoles, res)) return;

  try {
    const item = await config.model.findByPk(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Artikulli nuk u gjet.' });
    }

    await item.destroy();
    res.json({ message: 'Artikulli u fshi me sukses.' });
  } catch (error) {
    res.status(500).json({ message: 'Gabim gjatë fshirjes së artikullit.', error: error.message });
  }
};
