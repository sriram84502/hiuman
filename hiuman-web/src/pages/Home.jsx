import React from 'react';
import Hero from '../components/sections/Hero';
import Philosophy from '../components/sections/Philosophy';
import Features from '../components/sections/Features';
import VibeCheck from '../components/sections/VibeCheck';

const Home = () => {
    return (
        <main>
            <Hero />
            <Philosophy />
            <Features />
            <VibeCheck />
        </main>
    );
};

export default Home;
