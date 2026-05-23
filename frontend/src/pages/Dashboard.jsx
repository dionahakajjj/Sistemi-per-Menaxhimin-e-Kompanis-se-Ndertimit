import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (err) {
        setError('Dështoi ngarkimi i statistikave të dashboard-it.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Duke u ngarkuar...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger border-0 text-white bg-danger" role="alert">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        {error}
      </div>
    );
  }

  // Calculate task completion percentage
  const taskTotal = stats?.tasks?.total || 0;
  const taskCompleted = stats?.tasks?.completed || 0;
  const taskPercentage = taskTotal > 0 ? Math.round((taskCompleted / taskTotal) * 100) : 0;

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value || 0);
  };

  return (
    <div className="container-fluid p-0">
      <h4 className="fw-bold mb-4 text-white">Dashboard Analitik</h4>

      {/* Stats Cards Row */}
      <div className="row">
        {/* Projects Card */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card-custom">
            <div className="stat-widget">
              <div>
                <span className="text-muted small fw-semibold uppercase">PROJEKTET</span>
                <h2 className="fw-bold text-white mt-1 mb-0">{stats?.projects?.total || 0}</h2>
                <small className="text-success text-xs">Aktive në terren</small>
              </div>
              <div className="stat-icon stat-icon-amber">
                <i className="bi bi-building"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Workers Card */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card-custom">
            <div className="stat-widget">
              <div>
                <span className="text-muted small fw-semibold">PUNËTORËT</span>
                <h2 className="fw-bold text-white mt-1 mb-0">{stats?.workers?.active || 0}</h2>
                <small className="text-muted">nga {stats?.workers?.total || 0} gjithsej</small>
              </div>
              <div className="stat-icon stat-icon-blue">
                <i className="bi bi-people-fill"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Progress Card */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card-custom">
            <div className="stat-widget">
              <div className="w-70">
                <span className="text-muted small fw-semibold">PROGRESI I DETYRAVE</span>
                <h2 className="fw-bold text-white mt-1 mb-0">{taskPercentage}%</h2>
                <div className="progress bg-dark mt-2" style={{ height: '6px' }}>
                  <div 
                    className="progress-bar bg-success" 
                    role="progressbar" 
                    style={{ width: `${taskPercentage}%` }}
                    aria-valuenow={taskPercentage} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
                <small className="text-muted text-xs d-block mt-1">{taskCompleted}/{taskTotal} detyra kryer</small>
              </div>
              <div className="stat-icon stat-icon-green">
                <i className="bi bi-check2-square"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Revenue Card */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card-custom">
            <div className="stat-widget">
              <div>
                <span className="text-muted small fw-semibold">FATURAT (PAGUAR)</span>
                <h3 className="fw-bold text-success mt-1 mb-0">{formatCurrency(stats?.invoices?.totalPaid)}</h3>
                <small className="text-warning text-xs">
                  {formatCurrency(stats?.invoices?.totalPending)} në pritje
                </small>
              </div>
              <div className="stat-icon stat-icon-red">
                <i className="bi bi-cash-coin"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main dashboard lists */}
      <div className="row mt-2">
        {/* Recent Projects List */}
        <div className="col-12 col-lg-6 mb-4">
          <div className="card-custom h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-white mb-0">Projektet e Fundit</h5>
              <i className="bi bi-chevron-right text-muted"></i>
            </div>
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>Emri i Projektit</th>
                    <th>Klienti</th>
                    <th>Lokacioni</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentProjects?.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center py-3">Nuk ka të dhëna.</td>
                    </tr>
                  ) : (
                    stats?.recentProjects?.map((proj) => (
                      <tr key={proj.id}>
                        <td className="text-white fw-medium">{proj.emri}</td>
                        <td>{proj.client?.emri || '-'}</td>
                        <td>{proj.lokacioni || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Recent Invoices List */}
        <div className="col-12 col-lg-6 mb-4">
          <div className="card-custom h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold text-white mb-0">Faturat e Fundit</h5>
              <i className="bi bi-chevron-right text-muted"></i>
            </div>
            <div className="table-responsive">
              <table className="table table-custom">
                <thead>
                  <tr>
                    <th>Projekti</th>
                    <th>Klienti</th>
                    <th>Shuma</th>
                    <th>Statusi</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentInvoices?.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-3">Nuk ka të dhëna.</td>
                    </tr>
                  ) : (
                    stats?.recentInvoices?.map((inv) => (
                      <tr key={inv.id}>
                        <td className="text-white fw-medium">{inv.project?.emri || '-'}</td>
                        <td>{inv.client?.emri || '-'}</td>
                        <td className="text-white">{formatCurrency(inv.shuma)}</td>
                        <td>
                          <span className={`badge badge-custom ${
                            (inv.statusi || '').toLowerCase().includes('paguar') 
                              ? 'bg-success' 
                              : 'bg-warning text-dark'
                          }`}>
                            {inv.statusi || 'Në pritje'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
