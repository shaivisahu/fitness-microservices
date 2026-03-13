import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('fitness_user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = (authResponse) => {
        localStorage.setItem('fitness_token', authResponse.token);
        localStorage.setItem('fitness_user', JSON.stringify(authResponse.user));
        setUser(authResponse.user);
    };

    const logout = () => {
        localStorage.removeItem('fitness_token');
        localStorage.removeItem('fitness_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
