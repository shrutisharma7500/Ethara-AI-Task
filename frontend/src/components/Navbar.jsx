import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut, User as UserIcon } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard">
          <div className="logo-icon">T</div>
          TaskFlow
        </Link>
      </div>
      <div className="navbar-menu">
        <Link to="/dashboard" className="nav-link">
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </Link>
        <Link to="/projects" className="nav-link">
          <FolderKanban size={18} />
          <span>Projects</span>
        </Link>
      </div>
      <div className="navbar-user">
        <div className="user-info">
          <UserIcon size={18} />
          <span>{user.name} ({user.role})</span>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
