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
    
    emitAll(connections.length);
   /* for(var i = 0; i<connections.length; i++)
    {
      connections[i].client.emit("hello", connections.length);
    }*/
    
    client.on('disconnect', function() {
        
        console.log('Got disconnect!');
  
        var i = connections.findIndex((conClient)=>(conClient.client===client));
        console.log(i);
        var disconnectId = connections[i].clientId;
        connections.splice(i, 1);
        emitAll("Client " +  disconnectId + " disconnected" ); 
     });

      
  });  

  const emitAll = (data) => {
      for(var i = 0; i<connections.length; i++)
      {
          connections[i].client.emit("data", data);
      }
  }

  


server.listen(8080);
console.log('Server is alive');