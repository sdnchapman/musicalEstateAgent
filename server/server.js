var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/static'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

const connections = []

io.on('connection', function(client){
    connections.push({ client,"clientId" : connections.length+1 } );
    console.log('a user connected');
    for(var i = 0; i<connections.length; i++)
  {
      connections[i].emit("hello", connections.length);
  }  
  });

io.on('disconnect', function(client){
    var clientRemoved =  false;
    var clientIndex = 0;
    while(!clientRemoved)
    {
        if(client===connections[clientIndex].client)
        {
            connections.pop(clientIndex);
            clientRemoved=true;
        }
    }

    for(var i = 0; i<connections.length; i++)
    {
        connections[i].client.emit("clientId", connections[i].clientId);
    }
    
    
}
  


server.listen(8080);
console.log('Server is alive');