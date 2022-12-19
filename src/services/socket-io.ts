import { io } from 'socket.io-client';

const url = 'http://localhost:3333' ?? '';

const init = (walletAddress: string) => {
    return io(url, {
        query: { walletAddress },
        transports: ['websocket'],
    });
};

const serviceSocket = { init };

export default serviceSocket;
