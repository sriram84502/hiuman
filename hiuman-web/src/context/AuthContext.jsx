import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE } from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Check for token on mount
        const token = localStorage.getItem('hiuman_token');
        const savedUser = localStorage.getItem('hiuman_user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.ok) {
            localStorage.setItem('hiuman_token', data.token);
            localStorage.setItem('hiuman_user', JSON.stringify(data.user));
            setUser(data.user);
            navigate('/home');
            return { success: true };
        } else {
            return { success: false, message: data.message };
        }
    };

    const register = async (email, password, name) => {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            body: JSON.stringify({ email, password, name })
        });
        if (res.ok) {
            // Auto login or redirect to login? Let's auto login for flow
            return login(email, password);
        } else {
            const data = await res.json();
            return { success: false, message: data.message };
        }
    };

    const logout = () => {
        localStorage.removeItem('hiuman_token');
        localStorage.removeItem('hiuman_user');
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
