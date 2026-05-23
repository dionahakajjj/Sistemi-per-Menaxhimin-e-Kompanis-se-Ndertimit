import React from 'react';

const Navbar = ({ toggleSidebar }) => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  const username = user ? user.username : 'Përdorues';
  const role = user ? user.role : 'Punëtor';

  // Define badge class based on role
  const getRoleBadge = (role) => {
    switch (role) {
      case 'Admin':
        return 'bg-danger';
      case 'Menaxher':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="navbar-custom">
      <button 
        className="btn text-white d-lg-none border-0 p-0 fs-3" 
        onClick={toggleSidebar}
      >
        <i className="bi bi-list"></i>
      </button>

      <div className="d-flex align-items-center gap-2 ms-auto">
        <div className="text-end d-none d-sm-block">
          <div className="fw-semibold text-white">{username}</div>
          <small className="text-muted" style={{ fontSize: '0.78rem' }}>{user?.email}</small>
        </div>
        <span className={`badge ${getRoleBadge(role)} badge-custom fs-7`}>
          {role}
        </span>
        <div 
          className="bg-primary rounded-circle text-white d-flex align-items-center justify-content-center fw-bold"
          style={{ width: '38px', height: '38px', fontSize: '1.1rem' }}
        >
          {username.substring(0, 1).toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
