import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion } from 'framer-motion';

const OnboardingPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        mbti: '', vibe_type: 'chill', energy_level: 50, openness: 50, empathy_level: 50
    });

    const handleNext = () => setStep(step + 1);
    const handleSubmit = async () => {
        await api.post('/profile', { user_id: user.id, ...data });
        navigate('/home');
    };

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
            <Card variant="glass" className="w-full max-w-2xl p-8 min-h-[400px] flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold">Step {step} of 3</h2>
                        <div className="flex gap-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`h-2 w-8 rounded-full ${i <= step ? 'bg-neon-green' : 'bg-gray-800'}`} />
                            ))}
                        </div>
                    </div>

                    {step === 1 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                            <h3 className="text-4xl font-bold mb-4">Who are you?</h3>
                            <div>
                                <label className="block text-gray-400 mb-2">My MBTI Type (approx)</label>
                                <select
                                    className="w-full bg-zinc-900 border border-zinc-700 rounded p-3 text-white focus:border-neon-purple outline-none"
                                    value={data.mbti}
                                    onChange={(e) => setData({ ...data, mbti: e.target.value })}
                                >
                                    <option value="">Select...</option>
                                    <option value="INTJ">INTJ (Architect)</option>
                                    <option value="INFP">INFP (Mediator)</option>
                                    <option value="ENFP">ENFP (Campaigner)</option>
                                    <option value="ENTP">ENTP (Debater)</option>
                                    <option value="ISTP">ISTP (Virtuoso)</option>
                                    {/* Add more... */}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-400 mb-2">My Current Vibe</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['chill', 'chaotic', 'soft', 'mature', 'silly'].map(v => (
                                        <button
                                            key={v}
                                            onClick={() => setData({ ...data, vibe_type: v })}
                                            className={`p-3 rounded border capitalize ${data.vibe_type === v ? 'border-neon-pink bg-neon-pink/10 text-white' : 'border-zinc-800 text-gray-400 hover:border-zinc-600'}`}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                            <h3 className="text-4xl font-bold mb-4">Deep Traits</h3>

                            {[
                                { label: 'Energy Level (Introvert vs Extrovert)', key: 'energy_level' },
                                { label: 'Openness to Experience', key: 'openness' },
                                { label: 'Empathy Level', key: 'empathy_level' },
                            ].map(trait => (
                                <div key={trait.key}>
                                    <div className="flex justify-between mb-2">
                                        <label className="text-gray-400">{trait.label}</label>
                                        <span className="text-neon-blue font-mono">{data[trait.key]}%</span>
                                    </div>
                                    <input
                                        type="range" min="0" max="100"
                                        value={data[trait.key]}
                                        onChange={(e) => setData({ ...data, [trait.key]: Number(e.target.value) })}
                                        className="w-full accent-neon-blue bg-zinc-800 h-2 rounded-lg appearance-none cursor-pointer"
                                    />
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                            <h3 className="text-4xl font-bold mb-6">You're Ready.</h3>
                            <p className="text-xl text-gray-400 mb-8">
                                We've analyzed your psychology map. <br />
                                Your HIUMAN journey begins now.
                            </p>
                            <div className="w-32 h-32 mx-auto bg-neon-purple/20 rounded-full blur-xl animate-pulse-slow mb-8" />
                        </motion.div>
                    )}
                </div>

                <div className="flex justify-between mt-8">
                    {step > 1 && <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>}
                    <div className="ml-auto">
                        {step < 3 ? (
                            <Button variant="neon" onClick={handleNext}>Next Step</Button>
                        ) : (
                            <Button variant="neon" size="lg" onClick={handleSubmit} className="px-8">Enter HIUMAN</Button>
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default OnboardingPage;
