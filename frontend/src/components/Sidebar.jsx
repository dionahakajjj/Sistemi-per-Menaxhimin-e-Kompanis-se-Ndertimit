import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import api from '../services/api';

const Sidebar = ({ show, toggleSidebar }) => {
  const navigate = useNavigate();
  
  // Retrieve current user
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const role = user ? user.role : 'Punëtor';

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      await api.post('/auth/logout', { refreshToken });
    } catch (e) {
      console.error("Gabim gjatë çregjistrimit", e);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      navigate('/login');
    }
  };

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'bi-speedometer2', roles: ['Admin', 'Menaxher', 'Punëtor'] },
    { path: '/clients', label: 'Klientët', icon: 'bi-people', roles: ['Admin', 'Menaxher', 'Punëtor'] },
    { path: '/projects', label: 'Projektet', icon: 'bi-building-gear', roles: ['Admin', 'Menaxher', 'Punëtor'] },
    { path: '/project-phases', label: 'Fazat e Projektit', icon: 'bi-layers', roles: ['Admin', 'Menaxher', 'Punëtor'] },
    { path: '/tasks', label: 'Detyrat', icon: 'bi-list-task', roles: ['Admin', 'Menaxher', 'Punëtor'] },
    { path: '/task-assignments', label: 'Caktimi i Detyrave', icon: 'bi-person-badge', roles: ['Admin', 'Menaxher', 'Punëtor'] },
    { path: '/workers', label: 'Punëtorët', icon: 'bi-person-workspace', roles: ['Admin', 'Menaxher', 'Punëtor'] },
    { path: '/materials', label: 'Materialet', icon: 'bi-box-seam', roles: ['Admin', 'Menaxher', 'Punëtor'] },
    { path: '/material-usages', label: 'Përdorimi i Materialeve', icon: 'bi-cart-check', roles: ['Admin', 'Menaxher', 'Punëtor'] },
    { path: '/suppliers', label: 'Furnitorët', icon: 'bi-truck', roles: ['Admin', 'Menaxher', 'Punëtor'] },
    { path: '/equipment', label: 'Pajisjet', icon: 'bi-tools', roles: ['Admin', 'Menaxher', 'Punëtor'] },
    { path: '/invoices', label: 'Faturat', icon: 'bi-receipt', roles: ['Admin', 'Menaxher', 'Punëtor'] },
    { path: '/users', label: 'Përdoruesit', icon: 'bi-person-gear', roles: ['Admin'] },
  ];

  return (
    <div className={`sidebar ${show ? 'show' : ''}`}>
      <div className="sidebar-brand">
        <i className="bi bi-cone-striped"></i>
        <span>KONSTRUKSIONI</span>
      </div>
      <div className="sidebar-menu">
        {menuItems.map((item) => {
          if (!item.roles.includes(role)) return null;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={toggleSidebar}
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
      <div className="sidebar-footer">
        <button className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2" onClick={handleLogout}>
          <i className="bi bi-box-arrow-left"></i>
          <span>Çregjistrohu</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
