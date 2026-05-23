import React, { useState, useEffect } from 'react';
import api from '../services/api';

const GenericCRUD = ({ entityName, title, fields }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Pagination & Search States
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  // Modal states
  const [formOpen, setFormOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Dropdown relations options cache
  const [relationOptions, setRelationOptions] = useState({});

  // Role permissions check
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const role = user ? user.role : 'Punëtor';

  const canCreateOrUpdate = role === 'Admin' || role === 'Menaxher';
  const canDelete = role === 'Admin';

  // Fetch standard data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/crud/${entityName}`, {
        params: {
          q: search,
          page,
          limit
        }
      });
      setItems(response.data.data);
      setTotal(response.data.meta.total);
      setTotalPages(response.data.meta.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Gabim gjatë marrjes së të dhënave.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch relations options
  const fetchRelationOptions = async () => {
    const relationFields = fields.filter(f => f.type === 'relation');
    const optionsData = {};

    for (const field of relationFields) {
      try {
        const response = await api.get(`/crud/${field.relation.entity}`, {
          params: { limit: 1000 } // fetch all to fill options dropdown
        });
        optionsData[field.name] = response.data.data;
      } catch (err) {
        console.error(`Dështoi marrja e të dhënave për lidhjen ${field.relation.entity}:`, err);
      }
    }
    setRelationOptions(optionsData);
  };

  useEffect(() => {
    fetchData();
  }, [entityName, page, search]);

  useEffect(() => {
    fetchRelationOptions();
  }, [entityName, fields]);

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value === '' ? null : value
    });
    // Clear validation error when editing
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    fields.forEach(field => {
      // Check required
      if (field.required && (formData[field.name] === undefined || formData[field.name] === null || formData[field.name] === '')) {
        errors[field.name] = `Fusha ${field.label} është e detyrueshme.`;
      }
      // Check email
      if (field.type === 'email' && formData[field.name]) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData[field.name])) {
          errors[field.name] = 'Ju lutem shkruani një email të vlefshëm.';
        }
      }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Open Form Modal (Add / Edit)
  const openForm = (item = null) => {
    if (item) {
      // Edit mode
      setCurrentItem(item);
      const initialForm = {};
      fields.forEach(f => {
        initialForm[f.name] = item[f.name];
      });
      setFormData(initialForm);
    } else {
      // Create mode
      setCurrentItem(null);
      const initialForm = {};
      fields.forEach(f => {
        initialForm[f.name] = f.defaultValue !== undefined ? f.defaultValue : '';
      });
      setFormData(initialForm);
    }
    setFormErrors({});
    setFormOpen(true);
  };

  // Save Form (Create or Update)
  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError(null);
    try {
      if (currentItem) {
        // Edit API call
        const response = await api.put(`/crud/${entityName}/${currentItem.id}`, formData);
        setSuccessMsg(response.data.message || 'Artikulli u përditësua.');
      } else {
        // Create API call
        const response = await api.post(`/crud/${entityName}`, formData);
        setSuccessMsg(response.data.message || 'Artikulli u krijua.');
      }
      setFormOpen(false);
      fetchData();
      
      // Auto clear alert
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gabim gjatë ruajtjes së të dhënave.');
    }
  };

  // Delete Item
  const handleDelete = async (id) => {
    if (!window.confirm('A jeni të sigurt që dëshironi ta fshini këtë artikull?')) return;
    setError(null);
    try {
      const response = await api.delete(`/crud/${entityName}/${id}`);
      setSuccessMsg(response.data.message || 'Artikulli u fshi me sukses.');
      fetchData();
      setTimeout(() => setSuccessMsg(null), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Gabim gjatë fshirjes.');
    }
  };

  // View Details Modal
  const openView = (item) => {
    setCurrentItem(item);
    setViewOpen(true);
  };

  // Render Cell Content helper
  const renderCellContent = (item, field) => {
    if (field.displayFormatter) {
      return field.displayFormatter(item);
    }

    const val = item[field.name];

    if (field.type === 'relation') {
      const relConfig = field.relation;
      // Sequelize includes relation as camelCase (e.g. client, project, supplier)
      const relObject = item[relConfig.entity.replace(/-([a-z])/g, g => g[1].toUpperCase()).slice(0, -1)]; // simple conversion e.g. client-phases -> clientPhase
      // or find standard alias in item
      const relationKeys = Object.keys(item).filter(key => typeof item[key] === 'object' && item[key] !== null);
      
      // Find the matched object
      for (const k of relationKeys) {
        if (item[k] && item[k][relConfig.idField || 'id'] == val) {
          return item[k][relConfig.labelField];
        }
      }
      return val || '-';
    }

    if (val === null || val === undefined) return '-';
    if (field.type === 'date') return new Date(val).toLocaleDateString('sq-AL');
    return String(val);
  };

  return (
    <div className="container-fluid p-0">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h4 className="fw-bold mb-0 text-white">{title}</h4>
        {canCreateOrUpdate && (
          <button className="btn btn-amber-custom d-flex align-items-center gap-2" onClick={() => openForm(null)}>
            <i className="bi bi-plus-lg"></i>
            Shto të Re
          </button>
        )}
      </div>

      {/* Message Alerts */}
      {successMsg && (
        <div className="alert alert-success border-0 text-white bg-success d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-check-circle-fill"></i>
          <div>{successMsg}</div>
        </div>
      )}
      {error && (
        <div className="alert alert-danger border-0 text-white bg-danger d-flex align-items-center gap-2" role="alert">
          <i className="bi bi-exclamation-triangle-fill"></i>
          <div>{error}</div>
        </div>
      )}

      {/* Table Card wrapper */}
      <div className="card-custom bg-card">
        {/* Filters bar */}
        <div className="row g-3 mb-3 align-items-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="input-group">
              <span className="input-group-text bg-input border-secondary text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control form-control-custom"
                placeholder="Kërko..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>
          {loading && (
            <div className="col-auto">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Duke u ngarkuar...</span>
              </div>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="table-responsive">
          <table className="table table-custom">
            <thead>
              <tr>
                {fields.filter(f => !f.hiddenInTable).map(f => (
                  <th key={f.name}>{f.label}</th>
                ))}
                <th className="text-end" style={{ width: '150px' }}>Veprimet</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={fields.filter(f => !f.hiddenInTable).length + 1} className="text-center py-4">
                    Nuk u gjet asnjë regjistrim.
                  </td>
                </tr>
              ) : (
                items.map(item => (
                  <tr key={item.id}>
                    {fields.filter(f => !f.hiddenInTable).map(f => (
                      <td key={f.name}>
                        {renderCellContent(item, f)}
                      </td>
                    ))}
                    <td className="text-end">
                      <div className="d-flex justify-content-end gap-1">
                        <button className="btn btn-sm btn-outline-info border-0" onClick={() => openView(item)} title="Shiko">
                          <i className="bi bi-eye"></i>
                        </button>
                        {canCreateOrUpdate && (
                          <button className="btn btn-sm btn-outline-warning border-0" onClick={() => openForm(item)} title="Edito">
                            <i className="bi bi-pencil"></i>
                          </button>
                        )}
                        {canDelete && (
                          <button className="btn btn-sm btn-outline-danger border-0" onClick={() => handleDelete(item.id)} title="Fshi">
                            <i className="bi bi-trash"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination navigation */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
            <span className="text-muted small">Treguar {items.length} nga {total} regjistrime</span>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                  <button className="page-link bg-input border-secondary text-white" onClick={() => setPage(page - 1)}>Paraprake</button>
                </li>
                {[...Array(totalPages)].map((_, i) => (
                  <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
                    <button className="page-link bg-input border-secondary text-white" onClick={() => setPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link bg-input border-secondary text-white" onClick={() => setPage(page + 1)}>Pasuese</button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* ADD/EDIT FORM MODAL */}
      {formOpen && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content modal-content-custom">
              <div className="modal-header modal-header-custom">
                <h5 className="modal-title fw-bold text-white">
                  {currentItem ? `Edito Artikullin: #${currentItem.id}` : 'Shto Artikull të Ri'}
                </h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setFormOpen(false)}></button>
              </div>
              <form onSubmit={handleSave}>
                <div className="modal-body py-4">
                  <div className="row g-3">
                    {fields.map(field => {
                      if (field.name === 'id') return null;
                      // Don't show password field in Edit Mode unless explicitly designing for it
                      if (field.name === 'password' && currentItem) return null;

                      return (
                        <div key={field.name} className="col-12 col-md-6">
                          <label className="form-label text-white small fw-semibold">
                            {field.label} {field.required && <span className="text-danger">*</span>}
                          </label>

                          {field.type === 'select' && (
                            <select
                              className="form-select form-select-custom"
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleInputChange}
                            >
                              <option value="">Zgjidh...</option>
                              {field.options?.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                              ))}
                            </select>
                          )}

                          {field.type === 'relation' && (
                            <select
                              className="form-select form-select-custom"
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleInputChange}
                            >
                              <option value="">Zgjidh...</option>
                              {relationOptions[field.name]?.map(opt => (
                                <option key={opt[field.relation.idField || 'id']} value={opt[field.relation.idField || 'id']}>
                                  {opt[field.relation.labelField]}
                                </option>
                              ))}
                            </select>
                          )}

                          {field.type === 'textarea' && (
                            <textarea
                              className="form-control form-control-custom"
                              name={field.name}
                              rows="3"
                              value={formData[field.name] || ''}
                              onChange={handleInputChange}
                            ></textarea>
                          )}

                          {field.type !== 'select' && field.type !== 'relation' && field.type !== 'textarea' && (
                            <input
                              type={field.type === 'date' ? 'date' : field.type === 'number' ? 'number' : field.type === 'password' ? 'password' : 'text'}
                              className="form-control form-control-custom"
                              name={field.name}
                              value={formData[field.name] || ''}
                              onChange={handleInputChange}
                              step={field.type === 'number' ? '0.01' : undefined}
                            />
                          )}

                          {formErrors[field.name] && (
                            <div className="text-danger small mt-1">{formErrors[field.name]}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="modal-footer modal-footer-custom">
                  <button type="button" className="btn btn-secondary border-0 px-4" onClick={() => setFormOpen(false)}>Anulo</button>
                  <button type="submit" className="btn btn-amber-custom px-4">Ruaj</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {viewOpen && currentItem && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content modal-content-custom">
              <div className="modal-header modal-header-custom">
                <h5 className="modal-title fw-bold text-white">Detajet e Artikullit #{currentItem.id}</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setViewOpen(false)}></button>
              </div>
              <div className="modal-body py-4">
                <div className="row g-3">
                  {fields.map(field => {
                    // Skip password in viewing
                    if (field.type === 'password') return null;

                    return (
                      <div key={field.name} className="col-12 col-md-6 border-bottom border-secondary pb-2">
                        <div className="text-muted small fw-semibold">{field.label}</div>
                        <div className="text-white mt-1 fw-medium">
                          {renderCellContent(currentItem, field)}
                        </div>
                      </div>
                    );
                  })}
                  <div className="col-12 col-md-6 border-bottom border-secondary pb-2">
                    <div className="text-muted small fw-semibold">Krijuar Më</div>
                    <div className="text-white mt-1">
                      {currentItem.createdAt ? new Date(currentItem.createdAt).toLocaleString('sq-AL') : '-'}
                    </div>
                  </div>
                  <div className="col-12 col-md-6 border-bottom border-secondary pb-2">
                    <div className="text-muted small fw-semibold">Përditësuar Më</div>
                    <div className="text-white mt-1">
                      {currentItem.updatedAt ? new Date(currentItem.updatedAt).toLocaleString('sq-AL') : '-'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer modal-footer-custom">
                <button type="button" className="btn btn-secondary border-0 px-4" onClick={() => setViewOpen(false)}>Mbyll</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenericCRUD;
