import http from 'node:http';
import {Server} from 'socket.io';

const server = http.createServer();
const io = new Server(server);

export default io;
