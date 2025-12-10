import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';

const features = [
    { icon: '❤️', title: 'Meaningful Dating', color: 'text-red-500', desc: 'Real connections, no hookup culture.' },
    { icon: '🧡', title: 'Real Friendships', color: 'text-orange-500', desc: 'Find your tribe, not just a date.' },
    { icon: '💛', title: 'Emotional Intelligence', color: 'text-yellow-500', desc: 'Tools to understand yourself & others.' },
    { icon: '💙', title: 'Personality Science', color: 'text-blue-500', desc: 'MBTI, Big Five, Attachment Styles.' },
    { icon: '💜', title: 'Vibe Matching', color: 'text-purple-500', desc: 'Communication style & energy fit.' },
    { icon: '🧠', title: 'AI Companionship', color: 'text-pink-500', desc: 'Coaching to help you communicate.' },
];

const Philosophy = () => {
    return (
        <section className="py-24 bg-zinc-950 relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-4"
                    >
                        HIUMAN is <span className="text-red-500 line-through decoration-4 decoration-white/50">NOT</span> a Dating App.
                    </motion.h2>
                    <p className="text-xl text-gray-400">It's a Human Connection App.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                        >
                            <Card variant="glass" className="h-full hover:bg-white/10 transition-colors border-white/5">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className={`text-xl font-bold mb-2 ${feature.color}`}>{feature.title}</h3>
                                <p className="text-gray-400">{feature.desc}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Philosophy;
