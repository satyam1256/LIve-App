// src/OverlayManager.jsx
import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your backend URL

const OverlayManager = () => {
    const [overlays, setOverlays] = useState([]);
    const [newOverlay, setNewOverlay] = useState({ content: '', position: { x: 0, y: 0 }, size: { width: 100, height: 50 } });

    useEffect(() => {
        fetchOverlays();

        // Set up real-time updates
        socket.on('overlayUpdated', () => {
            fetchOverlays();
        });

        return () => {
            // Cleanup socket connection on component unmount
            socket.disconnect();
        };
    }, []);

    const fetchOverlays = async () => {
        try {
            const response = await axios.get('/api/overlays');
            setOverlays(response.data);
        } catch (error) {
            console.error('Error fetching overlays:', error);
        }
    };

    const createOverlay = async () => {
        try {
            await axios.post('/api/overlay', newOverlay);
            setNewOverlay({ content: '', position: { x: 0, y: 0 }, size: { width: 100, height: 50 } });
            socket.emit('overlayUpdated'); // Notify server about the overlay update
        } catch (error) {
            console.error('Error creating overlay:', error);
        }
    };

    const deleteOverlay = async (overlayId) => {
        try {
            await axios.delete(`/api/overlay/${overlayId}`);
            socket.emit('overlayUpdated'); // Notify server about the overlay update
        } catch (error) {
            console.error('Error deleting overlay:', error);
        }
    };

    const handleDrag = (e, ui) => {
        setNewOverlay({ ...newOverlay, position: { x: ui.x, y: ui.y } });
    };

    const handleResize = (e, { size }) => {
        setNewOverlay({ ...newOverlay, size: { width: size.width, height: size.height } });
    };

    return (
        <div>
            <h1>Overlay Manager</h1>
            <div>
                <h2>Create Overlay</h2>
                <label>Content:</label>
                <input
                    type="text"
                    value={newOverlay.content}
                    onChange={(e) => setNewOverlay({ ...newOverlay, content: e.target.value })}
                />
                <Draggable onDrag={handleDrag}>
                    <Resizable width={newOverlay.size.width} height={newOverlay.size.height} onResize={handleResize}>
                        <div className="overlay-preview" style={{ position: 'relative', background: '#e0e0e0', border: '1px solid #ccc' }}>
                            <div
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                {newOverlay.content}
                            </div>
                        </div>
                    </Resizable>
                </Draggable>
                <button onClick={createOverlay}>Create Overlay</button>
            </div>
            <div>
                <h2>Existing Overlays</h2>
                <ul>
                    {overlays.map((overlay) => (
                        <li key={overlay._id}>
                            <Draggable position={{ x: overlay.position.x, y: overlay.position.y }} onDrag={(e, ui) => handleDrag(e, ui)}>
                                <Resizable
                                    width={overlay.size.width}
                                    height={overlay.size.height}
                                    onResize={(e, { size }) => handleResize(e, { size })}
                                >
                                    <div
                                        className="overlay-preview"
                                        style={{
                                            position: 'relative',
                                            background: '#e0e0e0',
                                            border: '1px solid #ccc',
                                        }}
                                    >
                                        <div
                                            style={{
                                                position: 'absolute',
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {overlay.content}
                                        </div>
                                    </div>
                                </Resizable>
                            </Draggable>
                            <button onClick={() => deleteOverlay(overlay._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default OverlayManager;
