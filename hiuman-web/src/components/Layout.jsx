import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Flame, MessageCircle, Users, Radio, User, LogOut } from 'lucide-react';
import { Button } from './ui/Button';

const Layout = ({ children }) => {
    const { logout, user } = useAuth();

    // Safety check for user
    if (!user) return null; // Or redirect

    const navItems = [
        { icon: Flame, label: 'Matches', path: '/matches' },
        { icon: MessageCircle, label: 'Chat', path: '/chat', disabled: true }, // Chat is usually per match, maybe link to general chat list? assume '/chat' is list
        { icon: Users, label: 'Circles', path: '/circles' },
        { icon: Radio, label: 'Live', path: '/live' },
    ];

    return (
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
            {/* Sidebar / Mobile Bottom Nav */}
            <aside className="w-full md:w-64 bg-zinc-950 border-b md:border-r border-white/10 p-4 flex md:flex-col items-center md:items-start justify-between z-50 sticky top-0 md:h-screen">
                <div className="mb-8 hidden md:block">
                    <h1 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue">
                        HIUMAN
                    </h1>
                </div>

                <nav className="flex md:flex-col gap-2 w-full justify-around md:justify-start">
                    <NavLink to="/home" className={({ isActive }) => `p-3 rounded-lg flex items-center gap-3 transition-colors ${isActive ? 'bg-neon-green/10 text-neon-green' : 'text-gray-400 hover:bg-zinc-900'}`}>
                        <Users size={20} /> <span className="hidden md:inline">Dashboard</span>
                    </NavLink>
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `p-3 rounded-lg flex items-center gap-3 transition-colors ${isActive ? 'bg-neon-purple/10 text-neon-purple' : 'text-gray-400 hover:bg-zinc-900'}`}
                        >
                            <item.icon size={20} /> <span className="hidden md:inline">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="hidden md:block mt-auto w-full">
                    <div className="flex items-center gap-3 mb-4 p-2 bg-zinc-900 rounded-lg">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500" />
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500">Karma Lvl 2</p>
                        </div>
                    </div>
                    <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/10" onClick={logout}>
                        <LogOut size={16} className="mr-2" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
};

export default Layout;
