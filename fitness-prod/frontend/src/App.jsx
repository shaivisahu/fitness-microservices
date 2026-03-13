import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import WorkoutPage from './pages/WorkoutPage';
import AIPage from './pages/AIPage';
import NotificationsPage from './pages/NotificationsPage';
import './index.css';

function PrivateLayout({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return (
    <div className="layout">
      <Sidebar />
      <main className="main">{children}</main>
    </div>
  );
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" /> : <AuthPage />} />
      <Route path="/dashboard"     element={<PrivateLayout><Dashboard /></PrivateLayout>} />
      <Route path="/workouts"      element={<PrivateLayout><WorkoutPage /></PrivateLayout>} />
      <Route path="/ai"            element={<PrivateLayout><AIPage /></PrivateLayout>} />
      <Route path="/notifications" element={<PrivateLayout><NotificationsPage /></PrivateLayout>} />
      <Route path="*"              element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
