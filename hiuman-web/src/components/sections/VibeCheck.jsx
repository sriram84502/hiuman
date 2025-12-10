import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { api } from '../../lib/api';

const VibeCheck = () => {
    const [vibeLevel, setVibeLevel] = useState(50);
    const [showModal, setShowModal] = useState(false);
    const [matches, setMatches] = useState([]);

    const getVibeText = (level) => {
        if (level < 30) return "Soft, calm energy. Perfect for gentle conversations. ❄️";
        if (level < 70) return "Balanced energy. Ready for meaningful connection. ✨";
        return "High-energy, expressive and fun. Perfect for bold vibes. 🔥";
    };

    const handleFindMatch = async () => {
        // Log vibe to backend
        try {
            const res = await api.post('/vibes', { vibe_score: vibeLevel });
            if (res.recommendations) {
                setMatches(res.recommendations);
                setShowModal(true);
            }
        } catch (e) {
            console.error(e);
            // Fallback for demo if backend offline
            setMatches([
                { name: "Demo User", vibe: "Chill", match: "99%" }
            ]);
            setShowModal(true);
        }
    };

    return (
        <section className="py-20 relative px-4">
            <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-8 text-white">What's your vibe today?</h2>

                <Card variant="glass" className="p-8 backdrop-blur-xl">
                    <div className="mb-8">
                        <label className="flex justify-between text-gray-400 mb-4 font-bold">
                            <span>Chill ❄️</span>
                            <span>{vibeLevel}%</span>
                            <span>Chaotic 🔥</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={vibeLevel}
                            onChange={(e) => setVibeLevel(Number(e.target.value))}
                            className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-neon-green hover:accent-neon-blue transition-colors"
                        />
                    </div>

                    <div className="h-16 flex items-center justify-center mb-6">
                        <p className="text-lg text-neon-blue animate-pulse-slow font-medium">
                            {getVibeText(vibeLevel)}
                        </p>
                    </div>

                    <Button variant="neon" size="lg" className="w-full text-lg" onClick={handleFindMatch}>
                        Find My Vibe Match
                    </Button>
                </Card>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <Card variant="neon" className="max-w-md w-full relative bg-zinc-900 border-neon-green">
                            <button onClick={() => setShowModal(false)} className="absolute top-2 right-4 text-gray-400 hover:text-white text-2xl">&times;</button>
                            <h3 className="text-2xl font-bold mb-4">Vibe Matched!</h3>
                            <p className="text-gray-400 mb-4">Based on your {vibeLevel}% energy, we found:</p>

                            <div className="space-y-3 mb-6">
                                {matches.map((m, i) => (
                                    <div key={i} className="flex justify-between items-center p-3 bg-zinc-800 rounded">
                                        <div>
                                            <span className="font-bold text-white">{m.name}</span>
                                            <span className="text-xs text-gray-500 ml-2">({m.vibe})</span>
                                        </div>
                                        <span className="text-neon-green font-bold">{m.match}</span>
                                    </div>
                                ))}
                            </div>

                            <Button variant="outline" className="w-full" onClick={() => window.location.href = '/auth'}>
                                Join to Connect
                            </Button>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default VibeCheck;
