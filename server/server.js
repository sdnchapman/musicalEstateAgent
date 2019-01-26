var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/static'));
app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

const connections = []

var idCounter = 1;

io.on('connection', function(client){
    var isVip = false;
    if(connections.length===0){
        isVip = true;
    }
    else{
        isVip = false;
    }
    connections.push({"clientData": {
                    "type" : "test",
                    "clientId": idCounter,
                    "username": "bob"+idCounter,
                    "score" : 0,
                    isVip},
                    client})
        
    client.emit("clientInfo" , {"clientId": idCounter,
                                "vip": isVip});
    idCounter++;
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
        var disconnectId = connections[i].clientData.clientId;
        var newVip = false;
        if(connections[i].clientData.isVip)
        {
            newVip = true;
        }
        connections.splice(i, 1);
        emitAll("Client " +  disconnectId + " disconnected" ); 
        if(newVip)
        {
            connections[0].clientData.isVip = true;
            connections[0].client.emit("clientInfo" , {"clientId": connections[0].clientData.clientId,
            "vip": true});
        }
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