import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { motion } from 'framer-motion';

const HomePage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [karma, setKarma] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            // Assume user.id is available, fetching profile
            const p = await api.get(`/profile?user_id=${user.id}`);
            const k = await api.get('/karma');
            setProfile(p);
            setKarma(k);
            setLoading(false);
        };
        if (user) loadData();
    }, [user]);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading your digital soul...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header>
                <h1 className="text-3xl font-bold text-white mb-2">Hello, {user?.name}.</h1>
                <p className="text-gray-400">Your daily connection vibe check.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* HIUMAN Score */}
                <Card variant="neon" className="bg-gradient-to-br from-zinc-900 to-black border-neon-purple/20">
                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">HIUMAN Score</h3>
                    <div className="flex items-end gap-2">
                        <span className="text-6xl font-black text-white">{profile?.hiuman_score || 78}</span>
                        <span className="text-xl text-green-400 mb-2">/100</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Based on Empathy + Integrity</p>
                </Card>

                {/* Karma */}
                <Card variant="glass" className="bg-zinc-900/50">
                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">Karma Level</h3>
                    <div className="text-4xl font-bold text-neon-green mb-2">{karma?.level || 'Bronze'}</div>
                    <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-neon-green h-full w-[60%]" />
                    </div>
                    <p className="text-xs text-right text-gray-400 mt-1">{karma?.points} Points</p>
                </Card>

                {/* Matches Alert */}
                <Card variant="glass" className="bg-zinc-900/50 relative overflow-hidden group hover:border-neon-blue/50 transition-colors cursor-pointer">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
                        <Users size={64} />
                    </div>
                    <h3 className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-4">Deep Matches</h3>
                    <div className="text-5xl font-bold text-white mb-2">5</div>
                    <Button variant="link" className="p-0 text-neon-blue">View Pipeline &rarr;</Button>
                </Card>
            </div>

            {/* AI Assessment / Tasks */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card variant="glass">
                    <h3 className="text-xl font-bold mb-4">🌱 Growth Task</h3>
                    <div className="p-4 bg-zinc-900 rounded-lg border-l-4 border-neon-green mb-4">
                        <p className="italic text-gray-300">"Ask your match about their childhood dream."</p>
                    </div>
                    <Button variant="outline" className="w-full">Mark Complete (+50 Karma)</Button>
                </Card>

                <Card variant="glass">
                    <h3 className="text-xl font-bold mb-4">❤️ Relationship Pulse</h3>
                    <p className="text-gray-400 mb-4">You are generally attracting <strong>Diplomats</strong> (INFJ/ENFP). Try matching with an <em>Analyst</em> to balance your chaos.</p>
                </Card>
            </div>
        </div>
    );
};
import { Users } from 'lucide-react'; // Fix missing import
export default HomePage;
