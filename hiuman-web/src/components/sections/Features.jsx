import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

const BentoCard = ({ children, className, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.5 }}
        className={className}
    >
        <Card variant="glass" className="h-full flex flex-col justify-between overflow-hidden relative group hover:border-neon-purple/30 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            {children}
        </Card>
    </motion.div>
);

const Features = () => {
    return (
        <section className="py-24 bg-zinc-950 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6">
                        The Future of Connection
                    </h2>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        We replaced swiping with science, psychology, and vibe.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-auto md:grid-rows-3 gap-6 h-auto md:h-[800px]">
                    {/* DeepMatch - Large 2x2 */}
                    <BentoCard className="md:col-span-2 md:row-span-2" delay={0.1}>
                        <div className="p-6 relative z-10">
                            <div className="text-neon-blue font-mono text-sm mb-2">DEEPMATCH™ ALGORITHM</div>
                            <h3 className="text-4xl font-bold mb-4">Forget Swiping.</h3>
                            <p className="text-gray-300 text-lg mb-6">
                                HIUMAN gives you 3-7 curated matches per day based on personality, vibe, and values.
                                Quality over quantity.
                            </p>
                            <div className="w-full h-48 bg-gradient-to-r from-blue-900/20 to-purple-900/20 rounded-lg flex items-center justify-center border border-white/5 relative">
                                <a href="/live" className="absolute inset-0 z-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/60 backdrop-blur-sm rounded-lg">
                                    <Button variant="neon">Try Live Demo</Button>
                                </a>
                                <span className="text-2xl font-mono text-neon-blue animate-pulse">Calculating Compatibility...</span>
                            </div>
                        </div>
                    </BentoCard>

                    {/* 3D Personality - Tall 1x2 */}
                    <BentoCard className="md:col-span-1 md:row-span-2" delay={0.2}>
                        <div className="p-6 relative z-10">
                            <div className="text-neon-pink font-mono text-sm mb-2">3D PERSONALITY MAP</div>
                            <h3 className="text-2xl font-bold mb-4">More Than Just Photos.</h3>
                            <ul className="space-y-3 text-gray-400">
                                <li className="flex items-center gap-2"><span className="text-neon-pink">●</span> MBTI & Big Five</li>
                                <li className="flex items-center gap-2"><span className="text-neon-pink">●</span> Attachment Style</li>
                                <li className="flex items-center gap-2"><span className="text-neon-pink">●</span> Love Languages</li>
                                <li className="flex items-center gap-2"><span className="text-neon-pink">●</span> Vibe Type</li>
                            </ul>
                            <div className="mt-8 flex justify-center">
                                <div className="w-24 h-24 rounded-full border-2 border-neon-pink/50 animate-spin-slow flex items-center justify-center">
                                    <span className="text-2xl">🧠</span>
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Mini-Games - Standard 1x1 */}
                    <BentoCard className="md:col-span-1 md:row-span-1" delay={0.3}>
                        <div className="p-6 relative z-10">
                            <div className="text-neon-green font-mono text-sm mb-2">MINI-GAMES</div>
                            <h3 className="text-xl font-bold mb-2">Play to Connect.</h3>
                            <p className="text-sm text-gray-400">Truth or Comfort, Rapid Fire, Vibe Check.</p>
                        </div>
                        <div className="absolute -bottom-4 -right-4 text-8xl opacity-10 rotate-12">🎮</div>
                    </BentoCard>

                    {/* Safety - Standard 1x1 */}
                    <BentoCard className="md:col-span-1 md:row-span-1" delay={0.4}>
                        <div className="p-6 relative z-10">
                            <div className="text-yellow-500 font-mono text-sm mb-2">SAFETY FIRST</div>
                            <h3 className="text-xl font-bold mb-2">Zero Creeps.</h3>
                            <p className="text-sm text-gray-400">Mandatory video verification. Respect Score.</p>
                        </div>
                        <div className="absolute -bottom-4 -right-4 text-8xl opacity-10 rotate-12">🛡️</div>
                    </BentoCard>

                    {/* Karma System - Wide 2x1 */}
                    <BentoCard className="md:col-span-2 md:row-span-1" delay={0.5}>
                        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                            <div>
                                <div className="text-purple-400 font-mono text-sm mb-2">KARMA SYSTEM</div>
                                <h3 className="text-2xl font-bold mb-2">Good Vibes Only.</h3>
                                <p className="text-gray-400">Earn Karma Points for kind behavior. Level up to Diamond Human.</p>
                            </div>
                            <Button variant="neon" className="whitespace-nowrap">Join Waitlist</Button>
                        </div>
                    </BentoCard>

                    {/* AI Coach - Standard 1x1 (Filling the gap if any, 2+1+1 1st row vs 4 cols. Wait.
           Row 1: DeepMatch (2), 3D (1), Games (1) = 4 cols.
           Row 2: DeepMatch (cont), 3D (cont), Safety (1) = 4 cols.
           Row 3: Karma (2) ... need 2 more cols.
           Let's adjust layout.
           DeepMatch: 2 col, 2 row. (0,0) to (2,2)
           3D: 1 col, 2 row. (2,0) to (3,2)
           Games: 1 col, 1 row. (3,0)
           Safety: 1 col, 1 row. (3,1)
           Karma: 2 col, 1 row. (0,2) -> (2,3)
           
           Need 2 more cols for row 3 (cols 2,3).
           Let's add "Community" or "AI".
           */}

                    <BentoCard className="md:col-span-2 md:row-span-1" delay={0.6}>
                        <div className="p-6 relative z-10">
                            <div className="text-cyan-400 font-mono text-sm mb-2">AI COMPANION</div>
                            <h3 className="text-2xl font-bold mb-2">Never Get Ghosted.</h3>
                            <p className="text-gray-400">AI Chat Coach & Ghosting Guardian help you keep the conversation alive.</p>
                        </div>
                    </BentoCard>

                </div>
            </div>
        </section>
    );
};

export default Features;
