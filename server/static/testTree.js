/**
 * Created by clark on 25/01/2019.
 */
console.log('Test file loaded');
var socket = io('http://localhost');

socket.on('hello', function (length) {
    console.log(length);
    socket.emit('my other event', { my: 'data' });
});