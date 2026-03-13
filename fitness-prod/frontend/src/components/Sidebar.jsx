import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/dashboard',      icon: '📊', label: 'Dashboard'      },
  { path: '/workouts',       icon: '💪', label: 'Workouts'       },
  { path: '/ai',             icon: '🤖', label: 'AI Coach'       },
  { path: '/notifications',  icon: '🔔', label: 'Notifications'  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const initials = [user?.firstName?.[0], user?.lastName?.[0]].filter(Boolean).join('') || 'U';

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <h1>FIT<br/>TRACK</h1>
        <span>Microservices</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button key={item.path} className={`nav-item ${pathname === item.path ? 'active' : ''}`}
            onClick={() => navigate(item.path)}>
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        <button className="nav-item" onClick={logout} style={{ marginTop: 8 }}>
          <span className="nav-icon">🚪</span>
          Logout
        </button>
      </nav>

      <div className="sidebar-footer">
        <div className="user-chip">
          <div className="avatar">{initials}</div>
          <div className="user-chip-info">
            <div className="user-chip-name">{user?.firstName} {user?.lastName}</div>
            <div className="user-chip-goal">{user?.fitnessGoal?.replace('_', ' ')}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
