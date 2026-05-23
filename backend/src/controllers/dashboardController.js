const { Project, Worker, Task, Invoice, Client, Material } = require('../models');

exports.getStats = async (req, res) => {
  try {
    // 1. Projects stats
    const totalProjects = await Project.count();
    
    // 2. Active workers
    const activeWorkers = await Worker.count({
      where: {
        statusi: ['Aktiv', 'aktiv', 'Active', 'active']
      }
    }).catch(() => 0);
    // fallback if no rows matched or status strings are different, just count all workers
    const totalWorkers = await Worker.count();
    const finalActiveWorkers = activeWorkers || totalWorkers;

    // 3. Task status breakdown
    const taskStatusCounts = await Task.findAll({
      attributes: [
        [Task.sequelize.fn('COUNT', Task.sequelize.col('id')), 'count'],
        'statusi'
      ],
      group: ['statusi']
    });

    const tasksBreakdown = {
      todo: 0,
      inProgress: 0,
      completed: 0,
      total: 0
    };

    taskStatusCounts.forEach(t => {
      const status = (t.getDataValue('statusi') || '').toLowerCase();
      const count = parseInt(t.getDataValue('count'), 10) || 0;
      tasksBreakdown.total += count;

      if (status.includes('konfirmuar') || status.includes('mbaruar') || status.includes('kryer') || status.includes('complete') || status.includes('finish') || status.includes('paguar')) {
        tasksBreakdown.completed += count;
      } else if (status.includes('proces') || status.includes('progress') || status.includes('punë') || status.includes('filluar')) {
        tasksBreakdown.inProgress += count;
      } else {
        tasksBreakdown.todo += count;
      }
    });

    // 4. Invoices stats
    const totalInvoices = await Invoice.count();
    const invoiceSums = await Invoice.findAll({
      attributes: [
        [Invoice.sequelize.fn('SUM', Invoice.sequelize.col('shuma')), 'total'],
        'statusi'
      ],
      group: ['statusi']
    });

    let totalBilled = 0;
    let totalPaid = 0;
    let totalPending = 0;

    invoiceSums.forEach(inv => {
      const status = (inv.getDataValue('statusi') || '').toLowerCase();
      const total = parseFloat(inv.getDataValue('total')) || 0;
      totalBilled += total;

      if (status.includes('paguar') || status.includes('paid')) {
        totalPaid += total;
      } else {
        totalPending += total;
      }
    });

    // 5. Recent Projects & Clients for Dashboard feed
    const recentProjects = await Project.findAll({
      limit: 5,
      order: [['id', 'DESC']],
      include: [{ model: Client, as: 'client', attributes: ['emri'] }]
    });

    const recentInvoices = await Invoice.findAll({
      limit: 5,
      order: [['id', 'DESC']],
      include: [
        { model: Project, as: 'project', attributes: ['emri'] },
        { model: Client, as: 'client', attributes: ['emri'] }
      ]
    });

    res.json({
      projects: {
        total: totalProjects
      },
      workers: {
        active: finalActiveWorkers,
        total: totalWorkers
      },
      tasks: tasksBreakdown,
      invoices: {
        count: totalInvoices,
        totalBilled,
        totalPaid,
        totalPending
      },
      recentProjects,
      recentInvoices
    });
  } catch (error) {
    res.status(500).json({ message: 'Gabim gjatë llogaritjes së statistikave.', error: error.message });
  }
};
