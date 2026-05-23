import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Ju lutem plotësoni të gjitha fushat.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { username, password });
      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Lidhja me serverin dështoi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <i className="bi bi-cone-striped"></i>
          <h4 className="fw-bold mt-2 text-white">KONSTRUKSIONI</h4>
          <small className="text-muted">Menaxhimi i Kompanisë së Ndërtimit</small>
        </div>

        {error && (
          <div className="alert alert-danger border-0 bg-danger text-white py-2 px-3 small rounded mb-3" role="alert">
            <i className="bi bi-exclamation-circle-fill me-2"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-white small fw-medium">Përdoruesi ose Email</label>
            <input
              type="text"
              className="form-control form-control-custom text-white"
              placeholder="Shkruani username ose email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <div className="d-flex justify-content-between">
              <label className="form-label text-white small fw-medium">Fjalëkalimi</label>
            </div>
            <input
              type="password"
              className="form-control form-control-custom text-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-amber-custom w-100 py-2.5 mb-3"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            Identifikohu
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="text-muted small">Nuk keni llogari? </span>
          <Link to="/register" className="text-warning small text-decoration-none fw-semibold">
            Regjistrohu këtu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
