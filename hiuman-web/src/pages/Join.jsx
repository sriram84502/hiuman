import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { API_BASE } from '../lib/api';

const Join = () => {
    const [formData, setFormData] = useState({ email: '', passcode: '' });
    const [status, setStatus] = useState('idle'); // idle, loading, success, error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');

        try {
            // In local dev we point to the absolute path or setup proxy. 
            // For now, let's assume relative path works if served correctly, or mock it.
            // Since frontend is Vite (5173) and backend is PHP (8000 probably?), we need full URL.
            const res = await fetch(`${API_BASE}/signup.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (err) {
            console.error(err);
            // Fallback for demo if backend isn't running
            if (import.meta.env.DEV) {
                setTimeout(() => setStatus('success'), 1000);
            } else {
                setStatus('error');
            }
        }
    };

    if (status === 'success') {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card variant="neon" className="p-12 text-center max-w-md">
                    <h2 className="text-3xl font-bold mb-4 text-neon-green">Welcome to the Club.</h2>
                    <p className="text-gray-300 mb-8">You are officially on the HIUMAN waitlist.</p>
                    <Link to="/">
                        <Button variant="outline">Back to Home</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-black/50 z-0" />
            <Card variant="glass" className="w-full max-w-md p-8 relative z-10 border-neon-purple/30">
                <h2 className="text-3xl font-bold mb-2 text-center">Join HIUMAN</h2>
                <p className="text-center text-gray-400 mb-6">Enter the inner circle.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <Input
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Passcode (Create one)</label>
                        <Input
                            type="password"
                            placeholder="••••••"
                            value={formData.passcode}
                            onChange={(e) => setFormData({ ...formData, passcode: e.target.value })}
                            required
                        />
                    </div>
                    <Button
                        variant="neon"
                        className="w-full"
                        disabled={status === 'loading'}
                    >
                        {status === 'loading' ? 'Joining...' : 'Get Early Access'}
                    </Button>
                    {status === 'error' && <p className="text-red-500 text-sm text-center">Something went wrong. Try again.</p>}
                </form>
            </Card>
        </div>
    );
};

export default Join;
