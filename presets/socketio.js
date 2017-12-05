import builtin from './builtin.js';
import typedArraysSocketIO from '../types/typed-arrays-socketio.js';
export default [
    builtin,
    {ArrayBuffer: null}, // Leave ArrayBuffer as is, and let socket.io stream it instead.
    typedArraysSocketIO // Encapsulate TypedArrays in ArrayBuffers instead of base64 strings.
];
