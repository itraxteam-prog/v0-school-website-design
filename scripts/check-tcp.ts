
import { Socket } from 'net';

const host = 'ep-withered-boat-ai8d6rmr.c-4.us-east-1.aws.neon.tech';
const port = 5432;

const checkConnection = () => {
    console.log(`Checking connection to ${host}:${port}...`);
    const socket = new Socket();
    socket.setTimeout(5000);

    socket.on('connect', () => {
        console.log('SUCCESS: Connected to host!');
        socket.destroy();
        process.exit(0);
    });

    socket.on('timeout', () => {
        console.log('FAILURE: Connection timed out.');
        socket.destroy();
        process.exit(1);
    });

    socket.on('error', (err) => {
        console.log(`FAILURE: Connection error: ${err.message}`);
        socket.destroy();
        process.exit(1);
    });

    socket.connect(port, host);
};

checkConnection();
