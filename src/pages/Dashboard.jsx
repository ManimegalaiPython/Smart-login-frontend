import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';   // ✅ ADDED
import api from '../service/api';
import EmployeesList from './EmployeesList';
import AttendanceView from './AttendanceView';
import SettingsView from './SettingsView';

import '../styles/Dashboard.css';

const Dashboard = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();   // ✅ ADDED
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    departments: 0
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const isAdmin = user?.isAdmin || false;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, msgRes] = await Promise.all([
          api.get('/api/stats/'),
          api.get('/api/dashboard/')
        ]);
        setStats(statsRes.data);
        setMessage(msgRes.data.message);
      } catch (error) {
        console.error('Fetch error', error);
        setMessage('Unable to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ FIXED LOGOUT
  const handleLogout = () => {
    logout();
    navigate('/login');   // 🔥 FIX HERE
  };

  if (loading) {
    return (
      <div className="spinner-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-area">
          <h2>EMS</h2>
          <p>Employee Management</p>
        </div>

        <nav className="nav-menu">
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
               onClick={() => setActiveTab('dashboard')}>
            <span>Dashboard</span>
          </div>

          {isAdmin && (
            <div className={`nav-item ${activeTab === 'employees' ? 'active' : ''}`}
                 onClick={() => setActiveTab('employees')}>
              <span>Employees</span>
            </div>
          )}

          <div className={`nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
               onClick={() => setActiveTab('attendance')}>
            <span>Attendance</span>
          </div>

          <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
               onClick={() => setActiveTab('settings')}>
            <span>Settings</span>
          </div>
        </nav>

        <div className="logout-btn" onClick={handleLogout}>
          <span>Logout</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="top-header">
          <div className="header-title">
            <h1>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h1>
            <p>Welcome back, {user?.email || 'Employee'}</p>
          </div>
        </header>

        <div className="content-area">
          {activeTab === 'dashboard' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-title">Total Employees</div>
                  <div className="stat-value">{stats.totalEmployees}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">Present Today</div>
                  <div className="stat-value">{stats.presentToday}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">On Leave</div>
                  <div className="stat-value">{stats.onLeave}</div>
                </div>

                <div className="stat-card">
                  <div className="stat-title">Departments</div>
                  <div className="stat-value">{stats.departments}</div>
                </div>
              </div>

              <div className="protected-message">{message}</div>
            </>
          )}

          {activeTab === 'employees' && isAdmin && <EmployeesList />}
          {activeTab === 'attendance' && <AttendanceView isAdmin={isAdmin} />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
