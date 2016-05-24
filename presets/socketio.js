module.exports = [
    require('./builtin'),
    {ArrayBuffer: null}, // Leave ArrayBuffer as is, and let socket.io stream it instead.
    require('../types/typed-arrays-socketio') // Encapsulate TypedArrays in ArrayBuffers instead of base64 strings.
];
