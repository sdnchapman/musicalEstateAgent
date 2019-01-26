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
    /*if(connections.length===0){
        isVip = true;
    }
    else{
        isVip = false;
    }*/
    connections.push({"clientData": {
                    "type" : "test",
                    "clientId": idCounter,
                    "username": "",
                    "score" : 0,
                    isVip},
                    client})
        
    client.emit("clientInfo" , {"clientId": idCounter,
                                "vip": isVip});
    idCounter++;
    console.log('a user connected');
    
    emitAll(connections.length);
    
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

        if(connections.length >= 1 && newVip)
        {
            var vipIndex = 0;
            var vipFound = false;
            while(!vipFound)
            {
                if(connections[vipIndex].clientData.username !== "")
                {
                    vipFound = true;
                    connections[vipIndex].clientData.isVip = true;
                    connections[vipIndex].client.emit("NEW_VIP" , {"clientId": connections[vipIndex].clientData.clientId,
                    "vip": connections[vipIndex].clientData.isVip});
                }
                else{
                    vipIndex++;
                }
            }          
        }
     });

     client.on('REGISTER_USERNAME', function(username){
        var i = connections.findIndex((conClient)=>(conClient.client===client));
        connections[i].clientData.username = username;
        console.log(username);
        if(connections.findIndex((conClient)=>(conClient.clientData.isVip)) === -1)
        {
            connections[i].clientData.isVip = true;
        }
        
        connections[i].client.emit("REGISTERED" , {"clientId": connections[i].clientData.clientId,
        "vip": connections[i].clientData.isVip});
     });

     client.on('RECEIVE_SCORE', function(score){
        var i = connections.findIndex((conClient)=>(conClient.client===client));
        connections[i].clientData.username += score;
     });

     client.on('REGISTER_TYPE', function(team){
        var i = connections.findIndex((conClient)=>(conClient.client===team));
        connections[i].clientData.type = team;
     });

     client.on('EVERYBODY_READY', function(){
        selectConductor();
     });
  });

  const selectConductor = () => {
    conductorSelect = Math.floor(Math.random() * connections.length);  
    for(var i = 0; i<connections.length; i++)
    {
        if(i===conductorSelect)
        {
            connections[i].clientData.type = "CONDUCTOR";
            connections[i].client.emit("CONDUCTOR_SETUP");
        }
        else
        {
            connections[i].clientData.type = "MUSICIAN";
            connections[i].client.emit("MUSICIAN_SETUP");
        }
    }
  }

  
   

  const emitAll = (data) => {
      for(var i = 0; i<connections.length; i++)
      {
          connections[i].client.emit("data", data);
      }
  }

server.listen(8080);
console.log('Server is alive');