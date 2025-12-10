// In Monolith, everything is same-origin.
export const API_BASE = '/api';

export const api = {
    get: async (endpoint) => {
        const token = localStorage.getItem('hiuman_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`; // Backend expects this? MVP AuthController didn't check header but good practice.

        const res = await fetch(`${API_BASE}${endpoint}`, { headers });
        return res.json();
    },

    post: async (endpoint, data) => {
        const token = localStorage.getItem('hiuman_token');
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        return res.json();
    }
};
