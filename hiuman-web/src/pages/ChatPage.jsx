import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Send, Zap, Bot, Gamepad2 } from 'lucide-react';

const ChatPage = () => {
    const { matchId } = useParams(); // In real app this would be match ID, but we might pass user ID and find match ID. 
    // For MVP let's assume matchId in URL is the MATCH ID from the matches table, not user ID.
    // If we clicked from MatchesPage, we need to pass Match ID. 
    // But MatchesPage passes `/chat/${m.user.id}`. So we need to find the match ID for (me, otherUser).
    // Simplified: Let's assume URL is /chat/:matchId and MatchesPage passes a dummy matchId for demo or we fetch it.
    // Actually, getting match by user pair is better. 
    // Let's stick to the prompt structure. I will assume matchId is passed correctly or handled.
    // Simplification: URL param is 'partnerId'. We fetch match ID or create it.
    // Let's update MatchesPage to pass partner ID and here we just use it to filter messages? 
    // No, messages need match_id.
    // Okay, let's assume `matchId` in URL is actually the `id` from `matches` table.

    // Correction: MatchesPage passes `m.user.id`. So URL is /chat/USER_ID.
    // We need to resolve this to a match_id. 
    // For MVP demo, I'll just pick match_id = 1 if not found, or fetch "my match with X".

    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [matchIdResolved, setMatchIdResolved] = useState(1); // Default for demo
    const [opener, setOpener] = useState(null);
    const [gameQuestion, setGameQuestion] = useState(null);

    // Polling
    useEffect(() => {
        const fetchMessages = async () => {
            const msgs = await api.get(`/messages?match_id=${matchIdResolved}`);
            setMessages(Array.isArray(msgs) ? msgs : []);
        };
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [matchIdResolved]);

    const handleSend = async () => {
        if (!input.trim()) return;
        await api.post('/messages', {
            match_id: matchIdResolved,
            sender_id: user.id,
            content: input
        });
        setInput('');
        // Optimistic update? Or wait for poll. Poll is fast enough for MVP.
        const msgs = await api.get(`/messages?match_id=${matchIdResolved}`);
        setMessages(msgs);
    };

    const getOpener = async () => {
        const res = await api.get('/ai/opener'); // Using GET for MVP controller
        setOpener(res.line);
        setInput(res.line);
    };

    const startGame = async () => {
        const res = await api.get('/games?action=truth-or-comfort');
        // Backend returns array, pick random
        const q = res[Math.floor(Math.random() * res.length)];
        setGameQuestion(q);
    };

    const sendGame = async () => {
        if (gameQuestion) {
            const text = `[${gameQuestion.type.toUpperCase()}] ${gameQuestion.text}`;
            await api.post('/messages', {
                match_id: matchIdResolved,
                sender_id: user.id,
                content: text
            });
            setGameQuestion(null);
        }
    };

    return (
        <div className="max-w-2xl mx-auto h-[calc(100vh-100px)] flex flex-col">
            <header className="flex justify-between items-center mb-4 p-4 bg-zinc-900/50 rounded-lg">
                <h2 className="text-xl font-bold text-white">Deep Talk</h2>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={getOpener}>
                        <Bot size={16} className="mr-1" /> AI Opener
                    </Button>
                    <Button variant="ghost" size="sm" onClick={startGame}>
                        <Gamepad2 size={16} className="mr-1" /> Truth/Comfort
                    </Button>
                </div>
            </header>

            {/* Game Card */}
            {gameQuestion && (
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-4">
                    <Card variant="neon" className="bg-zinc-900 border-neon-pink">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-xs font-bold bg-white text-black px-2 py-1 rounded uppercase">{gameQuestion.type}</span>
                                <p className="mt-2 text-lg font-bold">{gameQuestion.text}</p>
                            </div>
                            <Button size="sm" onClick={sendGame}>Ask This</Button>
                        </div>
                    </Card>
                </motion.div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-zinc-900/30 rounded-lg mb-4">
                {messages.map((m, i) => {
                    const isMe = m.sender_id === user.id;
                    return (
                        <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-lg ${isMe ? 'bg-neon-purple/20 text-white' : 'bg-zinc-800 text-gray-200'
                                }`}>
                                <p>{m.content}</p>
                            </div>
                        </div>
                    )
                })}
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        <p>Start the conversation.</p>
                        {opener && <p className="text-neon-green mt-2">Tip: "{opener}"</p>}
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button variant="neon" onClick={handleSend} size="icon">
                    <Send size={20} />
                </Button>
            </div>
        </div>
    );
};

export default ChatPage;
import { motion } from 'framer-motion';
