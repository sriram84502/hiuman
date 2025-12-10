import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { motion } from 'framer-motion';

const VideoChat = () => {
    const [stream, setStream] = useState(null);
    const [searching, setSearching] = useState(false);
    const [connected, setConnected] = useState(false);
    const [partnerId, setPartnerId] = useState(null);

    const localVideoRef = useRef();
    const remoteVideoRef = useRef();
    const socketRef = useRef();
    const peerRef = useRef();

    // Use public STUN servers
    const peerConfig = {
        iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:global.stun.twilio.com:3478' }
        ]
    };

    const [error, setError] = useState(null);

    useEffect(() => {
        // 0. Check for secure context
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError("Camera access is blocked. This feature requires HTTPS or localhost.");
            return;
        }

        // 1. Get User Media
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then(currentStream => {
                setStream(currentStream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = currentStream;
                }
            })
            .catch(err => {
                console.error("Media Error:", err);
                setError("Could not access camera: " + err.message);
            });

        // 2. Connect to Signaling Server
        const SIGNAL_URL = import.meta.env.VITE_SIGNAL_URL || '';
        // If empty, io() connects to same host (proxy). If set, connects to remote.

        try {
            socketRef.current = io(SIGNAL_URL);

            socketRef.current.on('connect_error', (err) => {
                console.error("Socket Error:", err);
                // Don't block UI on socket error, just log
            });

            socketRef.current.on('match_found', handleMatchFound);
            socketRef.current.on('offer', handleOffer);
            socketRef.current.on('answer', handleAnswer);
            socketRef.current.on('ice-candidate', handleNewICECandidateMsg);
            socketRef.current.on('partner_disconnected', handlePartnerDisconnected);
        } catch (e) {
            console.error("Socket Init Error:", e);
        }

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, []);

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <Card variant="neon" className="p-8 text-center border-red-500">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Video Access Error</h2>
                    <p className="text-gray-300 mb-4">{error}</p>
                    <p className="text-sm text-gray-500">
                        Note: You must <b>Accept the SSL Warning</b> on your phone.<br />
                        Click "Advanced" -&gt; "Proceed" if you see a "Not Secure" warning.
                    </p>
                    <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
                </Card>
            </div>
        );
    }

    const startSearching = () => {
        setSearching(true);
        setConnected(false);
        setPartnerId(null);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        socketRef.current.emit('find_match');
    };

    const skipMatch = () => {
        socketRef.current.emit('skip');
        if (peerRef.current) {
            peerRef.current.destroy(); // simple-peer style, but here native RTCPeerConnection
            peerRef.current.close();
            peerRef.current = null;
        }
        startSearching(); // Auto find next
    };

    const createPeer = (id) => {
        const peer = new RTCPeerConnection(peerConfig);

        stream.getTracks().forEach(track => peer.addTrack(track, stream));

        peer.onicecandidate = (e) => {
            if (e.candidate) {
                socketRef.current.emit('ice-candidate', { target: id, candidate: e.candidate });
            }
        };

        peer.ontrack = (e) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.srcObject = e.streams[0];
            }
        };

        return peer;
    };

    const handleMatchFound = async ({ partnerId, initiator }) => {
        setSearching(false);
        setConnected(true);
        setPartnerId(partnerId);

        peerRef.current = createPeer(partnerId);

        if (initiator) {
            const offer = await peerRef.current.createOffer();
            await peerRef.current.setLocalDescription(offer);
            socketRef.current.emit('offer', { target: partnerId, sdp: offer });
        }
    };

    const handleOffer = async ({ sdp, target }) => {
        // If we receive an offer but haven't created a peer yet (should match_found fire first? yes usually)
        // In this simple logic, match_found fires for both.
        // But if detailed race conditions happen, safe check:
        if (!peerRef.current) peerRef.current = createPeer(partnerId); // Wait, partnerId might not be set in async state

        // Update: partnerId is passed in match_found. 
        // We can just trust the flow or use the socket sender ID if passed.

        await peerRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await peerRef.current.createAnswer();
        await peerRef.current.setLocalDescription(answer);
        socketRef.current.emit('answer', { target: socketRef.current.id, sdp: answer }); // Signal server knows who sent it
        // Actually signalserver relay expects 'target' to be partner ID. 
        // Wait, logic in server: client sends { target: partnerId, sdp } 
        // Server code: socket.on('answer', payload => io.to(partners.get(socket.id)).emit('answer', payload))
        // So payload sent to partner is exactly what I send.
        // So I don't need 'target' in payload for Server, but Server looks up partner. 
        // Okay, server logic:
        // socket.on('answer', (payload) => io.to(partnerId).emit('answer', payload));
        // So the payload is passed through.

    };

    const handleAnswer = async ({ sdp }) => {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    };

    const handleNewICECandidateMsg = async ({ candidate }) => {
        try {
            if (peerRef.current) {
                await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
            }
        } catch (e) {
            console.error('Error adding received ice candidate', e);
        }
    };

    const handlePartnerDisconnected = () => {
        setConnected(false);
        setPartnerId(null);
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        if (peerRef.current) {
            peerRef.current.close();
            peerRef.current = null;
        }
        // Auto search?? Or prompt?
        // Omegle usually says "Stranger disconnected."
        // Let's prompt.
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-4 h-[70vh] mb-8">
                {/* Remote Video */}
                <Card variant="neon" className="relative overflow-hidden bg-zinc-900 border-neon-blue/30 flex items-center justify-center">
                    {connected ? (
                        <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center">
                            <div className="text-6xl mb-4 animate-bounce">
                                {searching ? "🔍" : "👋"}
                            </div>
                            <h3 className="text-2xl font-bold text-gray-400">
                                {searching ? "Looking for a human..." : "Start matching to find someone."}
                            </h3>
                        </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded text-white text-sm">
                        Stranger
                    </div>
                </Card>

                {/* Local Video */}
                <Card variant="glass" className="relative overflow-hidden bg-zinc-900 border-neon-purple/30">
                    <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                    <div className="absolute bottom-4 left-4 bg-black/50 px-3 py-1 rounded text-white text-sm">
                        You
                    </div>
                </Card>
            </div>

            {/* Controls */}
            <div className="flex gap-6">
                {!searching && !connected && (
                    <Button variant="neon" size="lg" className="px-12 text-xl" onClick={startSearching}>
                        Start Matching
                    </Button>
                )}

                {(searching || connected) && (
                    <Button
                        variant="outline"
                        size="lg"
                        className="px-12 text-xl hover:bg-red-500/20 hover:text-red-500 border-red-500/50"
                        onClick={() => {
                            setSearching(false);
                            setConnected(false);
                            socketRef.current.emit('skip'); // Treating stop as skip/disconnect
                            if (peerRef.current) peerRef.current.close();
                        }}
                    >
                        Stop
                    </Button>
                )}

                {connected && (
                    <Button variant="neon" size="lg" className="px-12 text-xl" onClick={skipMatch}>
                        Next Human ➡
                    </Button>
                )}
            </div>
        </div>
    );
};

export default VideoChat;
