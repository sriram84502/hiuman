import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

const Hero = () => {
    return (
        <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/30 animate-pulse-slow" />
                <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-neon-purple/20 rounded-full blur-[128px] animate-float" />
                <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-neon-blue/20 rounded-full blur-[128px] animate-float" style={{ animationDelay: '2s' }} />
            </div>

            {/* Content */}
            <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "outCirc" }}
                >
                    <h2 className="text-neon-green font-mono mb-4 text-sm tracking-[0.3em] uppercase">The Complete & Final Master Blueprint</h2>
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-neon-purple to-neon-blue mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                        HIUMAN
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Match humans, not profiles.<br />
                        <span className="text-white font-semibold">Heal hearts, not hurt them.</span>
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <Button variant="neon" size="lg" className="rounded-full px-12 text-lg shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                        Join the Revolution
                    </Button>
                    <Button variant="outline" size="lg" className="rounded-full px-10 border-white/20 hover:bg-white/10 text-white">
                        Explore Features
                    </Button>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                className="absolute bottom-10 left-1/2 -translate-x-1/2"
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
            >
                <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-1">
                    <div className="w-1 h-2 bg-white rounded-full" />
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
