import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const res = await axios.get(`${API_URL}/tasks/dashboard`);
        setMetrics(res.data);
      } catch (err) {
        console.error('Error fetching dashboard', err);
      }
    };
    fetchDashboard();
  }, []);

  if (!metrics) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="page-title">Welcome back, {user?.name}!</h1>
      <p className="page-subtitle">Here is what's happening with your projects today.</p>

      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon total">
            <ListTodo size={24} />
          </div>
          <div className="metric-content">
            <h3>Total Tasks</h3>
            <p className="metric-value">{metrics.totalTasks}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon done">
            <CheckCircle2 size={24} />
          </div>
          <div className="metric-content">
            <h3>Completed</h3>
            <p className="metric-value">{metrics.tasksByStatus['Done'] || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon progress">
            <Clock size={24} />
          </div>
          <div className="metric-content">
            <h3>In Progress</h3>
            <p className="metric-value">{metrics.tasksByStatus['In Progress'] || 0}</p>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon overdue">
            <AlertCircle size={24} />
          </div>
          <div className="metric-content">
            <h3>Overdue Tasks</h3>
            <p className="metric-value">{metrics.overdueTasks}</p>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
         <div className="dashboard-section">
           <h2>Status Overview</h2>
           <div className="status-bars">
              <div className="status-bar-container">
                <span className="status-label">To Do</span>
                <div className="bar-bg">
                  <div className="bar-fill todo" style={{width: `${metrics.totalTasks ? ((metrics.tasksByStatus['To Do'] || 0) / metrics.totalTasks) * 100 : 0}%`}}></div>
                </div>
                <span className="status-count">{metrics.tasksByStatus['To Do'] || 0}</span>
              </div>
              <div className="status-bar-container">
                <span className="status-label">In Progress</span>
                <div className="bar-bg">
                  <div className="bar-fill progress" style={{width: `${metrics.totalTasks ? ((metrics.tasksByStatus['In Progress'] || 0) / metrics.totalTasks) * 100 : 0}%`}}></div>
                </div>
                <span className="status-count">{metrics.tasksByStatus['In Progress'] || 0}</span>
              </div>
              <div className="status-bar-container">
                <span className="status-label">Done</span>
                <div className="bar-bg">
                  <div className="bar-fill done" style={{width: `${metrics.totalTasks ? ((metrics.tasksByStatus['Done'] || 0) / metrics.totalTasks) * 100 : 0}%`}}></div>
                </div>
                <span className="status-count">{metrics.tasksByStatus['Done'] || 0}</span>
              </div>
           </div>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;
