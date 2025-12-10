import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Zap, Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const MatchesPage = () => {
    const { user } = useAuth();
    const [matches, setMatches] = useState([]);

    useEffect(() => {
        const load = async () => {
            // In real app, user ID from auth context automatically used or passed via token
            const data = await api.get(`/matches?user_id=${user.id}`);
            if (Array.isArray(data)) setMatches(data);
        };
        if (user) load();
    }, [user]);

    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Daily Curator</h1>
                <p className="text-gray-400">Quality over quantity. Matches expire in 24h.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matches.map((m) => (
                    <Card key={m.user.id} variant="glass" className="overflow-hidden hover:border-neon-purple/50 transition-colors group">
                        <div className="h-48 bg-zinc-800 relative">
                            {/* Placeholder Avatar Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
                            <div className="w-full h-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 group-hover:scale-105 transition-transform duration-500" />

                            <div className="absolute bottom-4 left-4">
                                <h3 className="text-2xl font-bold text-white">{m.user.name}, {m.user.age}</h3>
                                <p className="text-neon-blue text-sm">{m.user.tag} • {m.user.city}</p>
                            </div>
                        </div>

                        <div className="p-4 space-y-4">
                            <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-1 text-green-400" title="Overall Compatibility">
                                    <Heart size={16} fill="currentColor" /> {m.compatibility_score}% Match
                                </div>
                                <div className="flex items-center gap-1 text-yellow-400" title="Vibe Sync">
                                    <Zap size={16} fill="currentColor" /> {m.vibe_score}% Vibe
                                </div>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                <span className="bg-zinc-800 text-xs px-2 py-1 rounded text-gray-300 border border-white/5 uppercase">
                                    {m.user.vibe} Vibe
                                </span>
                            </div>

                            <div className="pt-2 flex gap-2">
                                <Link to={`/chat/${m.user.id}`} className="flex-1">
                                    <Button variant="neon" className="w-full">
                                        <MessageCircle size={16} className="mr-2" /> Start Chat
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="icon">
                                    More
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default MatchesPage;
