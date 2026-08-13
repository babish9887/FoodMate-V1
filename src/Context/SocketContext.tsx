import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Use VITE_SOCKET_URL if defined, otherwise fallback to VITE_API_URL
        const socketUrl = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL;

        if (!socketUrl) {
            console.warn('Socket URL is not defined. Skipping socket connection.');
            return;
        }

        console.log('Socket URL:', socketUrl);

        const newSocket = io(socketUrl, {
            withCredentials: true,
            transports: ['websocket', 'polling'], // Try websocket first
        });

        console.log('Socket created:', newSocket);

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected:', newSocket.id, newSocket);
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Socket disconnected');
            setIsConnected(false);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
