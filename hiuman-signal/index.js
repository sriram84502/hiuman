const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Allow all origins for MVP dev
        methods: ["GET", "POST"]
    }
});

// Queue to hold users looking for a match
let queue = [];
// Map to track active partners: socketId -> partnerSocketId
const partners = new Map();

io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('find_match', () => {
        console.log(`User ${socket.id} looking for match`);

        // If user is already in a call, do nothing (should typically hangup first)
        if (partners.has(socket.id)) return;

        if (queue.length > 0) {
            // Someone is waiting, match them!
            const partnerId = queue.shift();

            // Prevent matching with self (edge case)
            if (partnerId === socket.id) {
                queue.push(socket.id);
                return;
            }

            console.log(`Matching ${socket.id} with ${partnerId}`);

            partners.set(socket.id, partnerId);
            partners.set(partnerId, socket.id);

            // Notify both users
            io.to(socket.id).emit('match_found', { partnerId, initiator: true });
            io.to(partnerId).emit('match_found', { partnerId: socket.id, initiator: false });

        } else {
            // No one waiting, add to queue
            console.log(`User ${socket.id} added to queue`);
            queue.push(socket.id);
        }
    });

    // Relay WebRTC signals
    socket.on('offer', (payload) => {
        const partnerId = partners.get(socket.id);
        if (partnerId) {
            io.to(partnerId).emit('offer', payload);
        }
    });

    socket.on('answer', (payload) => {
        const partnerId = partners.get(socket.id);
        if (partnerId) {
            io.to(partnerId).emit('answer', payload);
        }
    });

    socket.on('ice-candidate', (payload) => {
        const partnerId = partners.get(socket.id);
        if (partnerId) {
            io.to(partnerId).emit('ice-candidate', payload);
        }
    });

    socket.on('skip', () => {
        handleDisconnect(socket);
        // Automatically find next match
        socket.emit('searching');
        // Re-trigger find match logic (client should re-emit 'find_match' or we call it here?)
        // Better for client to drive state, but let's just clean up here.
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
        handleDisconnect(socket);
    });

    function handleDisconnect(s) {
        // Remove from queue if waiting
        queue = queue.filter(id => id !== s.id);

        // Notify partner if in call
        const partnerId = partners.get(s.id);
        if (partnerId) {
            io.to(partnerId).emit('partner_disconnected');
            partners.delete(partnerId);
            partners.delete(s.id);
        }
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Signaling server running on port ${PORT}`);
});
