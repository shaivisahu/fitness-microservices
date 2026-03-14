import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import WorkoutPage from './pages/WorkoutPage';
import AIPage from './pages/AIPage';
import NotificationsPage from './pages/NotificationsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import Sidebar from './components/Sidebar';

function PrivateRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/" />;
}

function AdminRoute({ children }) {
    const { user } = useAuth();
    if (!user) return <Navigate to="/" />;
    if (user.role !== 'ADMIN') return <Navigate to="/dashboard" />;
    return children;
}

function AppLayout({ children }) {
    return (
        <div style={{ display: 'flex' }}>
            <Sidebar />
            <div style={{ flex: 1 }}>{children}</div>
        </div>
    );
}

function AppRoutes() {
    const { user } = useAuth();
    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to={user.role === 'ADMIN' ? '/admin' : '/dashboard'} /> : <AuthPage />} />
            <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
            <Route path="/workouts" element={<PrivateRoute><AppLayout><WorkoutPage /></AppLayout></PrivateRoute>} />
            <Route path="/ai" element={<PrivateRoute><AppLayout><AIPage /></AppLayout></PrivateRoute>} />
            <Route path="/notifications" element={<PrivateRoute><AppLayout><NotificationsPage /></AppLayout></PrivateRoute>} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        </Routes>
    );
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    );
}
