import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Lazy loaded page components
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Lazy loading named exports from CrudPages
const ClientsPage = lazy(() => import('./pages/CrudPages').then(m => ({ default: m.ClientsPage })));
const ProjectsPage = lazy(() => import('./pages/CrudPages').then(m => ({ default: m.ProjectsPage })));
const ProjectPhasesPage = lazy(() => import('./pages/CrudPages').then(m => ({ default: m.ProjectPhasesPage })));
const TasksPage = lazy(() => import('./pages/CrudPages').then(m => ({ default: m.TasksPage })));
const TaskAssignmentsPage = lazy(() => import('./pages/CrudPages').then(m => ({ default: m.TaskAssignmentsPage })));
const WorkersPage = lazy(() => import('./pages/CrudPages').then(m => ({ default: m.WorkersPage })));
const MaterialsPage = lazy(() => import('./pages/CrudPages').then(m => ({ default: m.MaterialsPage })));
const MaterialUsagesPage = lazy(() => import('./pages/CrudPages').then(m => ({ default: m.MaterialUsagesPage })));
const SuppliersPage = lazy(() => import('./pages/CrudPages').then(m => ({ default: m.SuppliersPage })));
const EquipmentPage = lazy(() => import('./pages/CrudPages').then(m => ({ default: m.EquipmentPage })));
const InvoicesPage = lazy(() => import('./pages/CrudPages').then(m => ({ default: m.InvoicesPage })));
const UsersPage = lazy(() => import('./pages/CrudPages').then(m => ({ default: m.UsersPage })));

// Loading spinner placeholder for Suspense boundaries
const PageLoader = () => (
  <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Duke u ngarkuar faqja...</span>
    </div>
  </div>
);

// Protected layout wrapper (requires auth)
const ProtectedLayout = ({ toggleSidebar, sidebarShow }) => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="d-flex">
      <Sidebar show={sidebarShow} toggleSidebar={toggleSidebar} />
      <div className="flex-grow-1">
        <Navbar toggleSidebar={toggleSidebar} />
        <div className="content-wrapper">
          <Suspense fallback={<PageLoader />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

// Admin Guard Wrapper
const AdminRoute = ({ children }) => {
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;
  
  if (!user || user.role !== 'Admin') {
    return (
      <div className="alert alert-danger text-center my-5 bg-danger text-white border-0 py-4" role="alert">
        <i className="bi bi-shield-lock-fill fs-1 d-block mb-3"></i>
        <h4 className="fw-bold">Gabim: Nuk keni autorizim!</h4>
        <p className="mb-0">Kjo faqe mund të aksesohet vetëm nga Administratorët e sistemit.</p>
      </div>
    );
  }
  return children;
};

const App = () => {
  const [sidebarShow, setSidebarShow] = useState(false);

  const toggleSidebar = () => {
    setSidebarShow(!sidebarShow);
  };

  return (
    <Router>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route 
            element={
              <ProtectedLayout 
                toggleSidebar={toggleSidebar} 
                sidebarShow={sidebarShow} 
              />
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/project-phases" element={<ProjectPhasesPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/task-assignments" element={<TaskAssignmentsPage />} />
            <Route path="/workers" element={<WorkersPage />} />
            <Route path="/materials" element={<MaterialsPage />} />
            <Route path="/material-usages" element={<MaterialUsagesPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/equipment" element={<EquipmentPage />} />
            <Route path="/invoices" element={<InvoicesPage />} />
            
            {/* Restricted Route */}
            <Route 
              path="/users" 
              element={
                <AdminRoute>
                  <UsersPage />
                </AdminRoute>
              } 
            />

            {/* Catch All redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
