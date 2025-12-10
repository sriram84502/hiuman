// Use Env var for Prod, fallback to local proxy for Dev
let url = import.meta.env.VITE_API_URL || '/api';
if (url.startsWith('http') && !url.endsWith('/api')) {
    url += '/api';
}
export const API_BASE = url;

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
