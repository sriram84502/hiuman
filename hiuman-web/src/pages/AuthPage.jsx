import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const { login, register } = useAuth();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        let res;
        if (isLogin) {
            res = await login(formData.email, formData.password);
        } else {
            res = await register(formData.email, formData.password, formData.name);
        }

        if (res && !res.success) {
            setError(res.message || 'Authentication failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/20 to-blue-900/20 pointer-events-none" />

            <Card variant="glass" className="w-full max-w-md p-8 relative z-10 border-white/10">
                <h2 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    {isLogin ? 'Welcome Back' : 'Join the Inner Circle'}
                </h2>
                <p className="text-center text-gray-500 mb-6">
                    {isLogin ? 'Continue your journey.' : 'Start your human revolution.'}
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <label className="block text-xs font-medium mb-1 text-gray-400 uppercase tracking-widest">Name</label>
                            <Input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Your Name"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400 uppercase tracking-widest">Email</label>
                        <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="you@hiuman.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium mb-1 text-gray-400 uppercase tracking-widest">Password</label>
                        <Input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <Button variant="neon" className="w-full h-12 text-lg">
                        {isLogin ? 'Enter' : 'Create Account'}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-gray-400 hover:text-white text-sm underline-offset-4 hover:underline"
                    >
                        {isLogin ? "Need an account? Join now" : "Already have an account? Login"}
                    </button>
                </div>
            </Card>
        </div>
    );
};

export default AuthPage;
