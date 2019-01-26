console.log('Test file loaded');
var socket = io({transports: ['websocket'], upgrade: false});
var clientId;
socket.on('data', function (length) {
    console.log(length);
    socket.emit('my other event', { my: 'data' });
    setTimeout(() => {
        console.log('sending name back');
        socket.emit('PLAYER_REGISTERING', { username: 'testBob' + Math.random() })
    }, 3000)
});

socket.on('clientInfo', function (clientInfo) {
    clientId = clientInfo.clientId;
    console.log("My Client UID is: " + clientId);
    console.log("Vip Status: " + clientInfo.vip)
});