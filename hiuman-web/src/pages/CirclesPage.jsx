import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Users, Hash } from 'lucide-react';

const CirclesPage = () => {
    const [circles, setCircles] = useState([]);

    useEffect(() => {
        const load = async () => {
            const data = await api.get('/circles');
            if (Array.isArray(data)) setCircles(data);
        };
        load();
    }, []);

    return (
        <div className="max-w-5xl mx-auto">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white">Circles</h1>
                <p className="text-gray-400">Find your tribe. Heal, grow, and vibe together.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {circles.map(c => (
                    <Card key={c.id} variant="glass" className="flex flex-col h-full hover:bg-zinc-900 transition-colors">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-neon-blue/10 rounded-lg text-neon-blue">
                                <Hash size={24} />
                            </div>
                            <Button variant="outline" size="sm">Join Circle</Button>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">{c.name}</h3>
                        <p className="text-gray-400 mb-4 flex-1">{c.description}</p>
                        <div className="flex items-center text-sm text-gray-500">
                            <Users size={16} className="mr-1" /> 128 Members
                        </div>
                    </Card>
                ))}

                {/* Promo Card */}
                <Card variant="neon" className="border-dashed border-2 border-zinc-700 bg-transparent flex items-center justify-center p-8">
                    <div className="text-center">
                        <p className="text-gray-400 mb-4">Want to start a new circle?</p>
                        <Button variant="ghost">Request Creation</Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CirclesPage;
