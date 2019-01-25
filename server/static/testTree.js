console.log('Test file loaded');
var socket = io({transports: ['websocket'], upgrade: false});

socket.on('hello', function (length) {
    console.log(length);
    socket.emit('my other event', { my: 'data' });
    setTimeout(() => {
        console.log('sending name back');
        socket.emit('PLAYER_REGISTERING', { username: 'testBob' + Math.random() })
    }, 3000)
});