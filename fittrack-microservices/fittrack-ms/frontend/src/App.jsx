import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import Workouts from './components/workout/Workouts';
import Diet from './components/diet/Diet';
import Progress from './components/charts/Progress';
import AiCoach from './components/ai/AiCoach';
import Profile from './components/dashboard/Profile';
import './styles/global.css';

function Guard({ children }) {
    const { user, loading } = useAuth();
    if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
    return user ? children : <Navigate to="/login" replace />;
}

function Layout({ children }) {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-content">{children}</main>
        </div>
    );
}

function AppRoutes() {
    const { user } = useAuth();
    return (
        <Routes>
            <Route path="/login"    element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            <Route path="/dashboard" element={<Guard><Layout><Dashboard /></Layout></Guard>} />
            <Route path="/workouts"  element={<Guard><Layout><Workouts /></Layout></Guard>} />
            <Route path="/diet"      element={<Guard><Layout><Diet /></Layout></Guard>} />
            <Route path="/progress"  element={<Guard><Layout><Progress /></Layout></Guard>} />
            <Route path="/ai"        element={<Guard><Layout><AiCoach /></Layout></Guard>} />
            <Route path="/profile"   element={<Guard><Layout><Profile /></Layout></Guard>} />
            <Route path="*"          element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
                <Toaster position="top-right" toastOptions={{
                    style: { background:'#14141f', color:'#f4f4fc', border:'1px solid rgba(200,255,0,0.15)', borderRadius:'8px', fontSize:'12px', fontFamily:"'DM Mono',monospace" },
                    success: { iconTheme: { primary:'#c8ff00', secondary:'#000' } },
                    error:   { iconTheme: { primary:'#ff2d78', secondary:'#fff' } },
                }} />
            </AuthProvider>
        </BrowserRouter>
    );
}
