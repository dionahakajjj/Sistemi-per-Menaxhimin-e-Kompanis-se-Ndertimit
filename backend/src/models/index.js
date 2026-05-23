const sequelize = require('../config/db');

const User = require('./User');
const Client = require('./Client');
const Project = require('./Project');
const Worker = require('./Worker');
const ProjectPhase = require('./ProjectPhase');
const Task = require('./Task');
const TaskAssignment = require('./TaskAssignment');
const Supplier = require('./Supplier');
const Material = require('./Material');
const MaterialUsage = require('./MaterialUsage');
const Equipment = require('./Equipment');
const Invoice = require('./Invoice');

// Setup relationships

// Clients -> Projects (1 to N)
Client.hasMany(Project, { foreignKey: 'klienti_id', as: 'projects', onDelete: 'CASCADE' });
Project.belongsTo(Client, { foreignKey: 'klienti_id', as: 'client' });

// Projects -> ProjectPhases (1 to N)
Project.hasMany(ProjectPhase, { foreignKey: 'projekti_id', as: 'phases', onDelete: 'CASCADE' });
ProjectPhase.belongsTo(Project, { foreignKey: 'projekti_id', as: 'project' });

// ProjectPhases -> Tasks (1 to N)
ProjectPhase.hasMany(Task, { foreignKey: 'faza_id', as: 'tasks', onDelete: 'CASCADE' });
Task.belongsTo(ProjectPhase, { foreignKey: 'faza_id', as: 'phase' });

// Tasks -> TaskAssignments (1 to N)
Task.hasMany(TaskAssignment, { foreignKey: 'detyra_id', as: 'assignments', onDelete: 'CASCADE' });
TaskAssignment.belongsTo(Task, { foreignKey: 'detyra_id', as: 'task' });

// Workers -> TaskAssignments (1 to N)
Worker.hasMany(TaskAssignment, { foreignKey: 'punetori_id', as: 'assignments', onDelete: 'CASCADE' });
TaskAssignment.belongsTo(Worker, { foreignKey: 'punetori_id', as: 'worker' });

// Projects -> MaterialUsages (1 to N)
Project.hasMany(MaterialUsage, { foreignKey: 'projekti_id', as: 'usages', onDelete: 'CASCADE' });
MaterialUsage.belongsTo(Project, { foreignKey: 'projekti_id', as: 'project' });

// Materials -> MaterialUsages (1 to N)
Material.hasMany(MaterialUsage, { foreignKey: 'materiali_id', as: 'usages', onDelete: 'CASCADE' });
MaterialUsage.belongsTo(Material, { foreignKey: 'materiali_id', as: 'material' });

// ProjectPhases -> MaterialUsages (1 to N)
ProjectPhase.hasMany(MaterialUsage, { foreignKey: 'faza_id', as: 'materialUsages', onDelete: 'SET NULL' });
MaterialUsage.belongsTo(ProjectPhase, { foreignKey: 'faza_id', as: 'phase' });

// Suppliers -> Materials (1 to N)
Supplier.hasMany(Material, { foreignKey: 'furnitori_id', as: 'materials', onDelete: 'SET NULL' });
Material.belongsTo(Supplier, { foreignKey: 'furnitori_id', as: 'supplier' });

// Projects -> Invoices (1 to N)
Project.hasMany(Invoice, { foreignKey: 'projekti_id', as: 'invoices', onDelete: 'CASCADE' });
Invoice.belongsTo(Project, { foreignKey: 'projekti_id', as: 'project' });

// Clients -> Invoices (1 to N)
Client.hasMany(Invoice, { foreignKey: 'klienti_id', as: 'invoices', onDelete: 'CASCADE' });
Invoice.belongsTo(Client, { foreignKey: 'klienti_id', as: 'client' });

module.exports = {
  sequelize,
  User,
  Client,
  Project,
  Worker,
  ProjectPhase,
  Task,
  TaskAssignment,
  Supplier,
  Material,
  MaterialUsage,
  Equipment,
  Invoice
};
