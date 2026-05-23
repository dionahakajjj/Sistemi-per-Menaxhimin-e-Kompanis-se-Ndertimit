import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Punëtor');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !email || !password) {
      setError('Ju lutem plotësoni të gjitha fushat.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
        role
      });

      const { accessToken, refreshToken, user } = response.data;

      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Regjistrimi dështoi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <i className="bi bi-cone-striped"></i>
          <h4 className="fw-bold mt-2 text-white">RREGJISTRIMI</h4>
          <small className="text-muted">Krijo llogarinë tënde në sistem</small>
        </div>

        {error && (
          <div className="alert alert-danger border-0 bg-danger text-white py-2 px-3 small rounded mb-3" role="alert">
            <i className="bi bi-exclamation-circle-fill me-2"></i>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert-success border-0 bg-success text-white py-2 px-3 small rounded mb-3" role="alert">
            <i className="bi bi-check-circle-fill me-2"></i>
            Regjistrimi u krye me sukses! Po ridrejtoheni...
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label text-white small fw-medium">Përdoruesi (Username)</label>
            <input
              type="text"
              className="form-control form-control-custom text-white"
              placeholder="Shkruani emrin e përdoruesit"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading || success}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white small fw-medium">Email Adresa</label>
            <input
              type="email"
              className="form-control form-control-custom text-white"
              placeholder="emri@kompania.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || success}
            />
          </div>

          <div className="mb-3">
            <label className="form-label text-white small fw-medium">Fjaliëkalimi</label>
            <input
              type="password"
              className="form-control form-control-custom text-white"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || success}
            />
          </div>

          <div className="mb-4">
            <label className="form-label text-white small fw-medium">Roli në Kompani</label>
            <select
              className="form-select form-select-custom text-white"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading || success}
            >
              <option value="Punëtor">Punëtor (Punonjës)</option>
              <option value="Menaxher">Menaxher (Menaxhues Projekti)</option>
              <option value="Admin">Admin (Administrator)</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-amber-custom w-100 py-2.5 mb-3"
            disabled={loading || success}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            ) : null}
            Krijo Llogarinë
          </button>
        </form>

        <div className="text-center mt-3">
          <span className="text-muted small">Keni llogari? </span>
          <Link to="/login" className="text-warning small text-decoration-none fw-semibold">
            Identifikohu këtu
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
