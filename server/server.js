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
    console.log('User ' + idCounter + ' is connected');
    idCounter++;
   
    
    emitAll(connections.length);
    
    client.on('disconnect', function() {
        
        
  
        var i = connections.findIndex((conClient)=>(conClient.client===client));
        console.log(i);
        var disconnectId = connections[i].clientData.clientId;
        console.log('userId ' + disconnectId +' Got disconnected!');
        var newVip = false;
        if(connections[i].clientData.isVip)
        {
            newVip = true;
            console.log('New VIP required');
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
                    console.log('New VIP Chosen: ClientId ' + connections[vipIndex].clientData.clientId);
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
        console.log("ClientId " + connections[i].clientData.clientId + " set username to " + connections[i].clientData.username);
        if(connections.findIndex((conClient)=>(conClient.clientData.isVip)) === -1)
        {
            connections[i].clientData.isVip = true;
            console.log("ClientId " + connections[i].clientData.clientId + " set as VIP");
        
        }
        
        connections[i].client.emit("REGISTERED" , {"clientId": connections[i].clientData.clientId,
        "vip": connections[i].clientData.isVip});
     });

     client.on('RECEIVE_SCORE', function(score){
        var i = connections.findIndex((conClient)=>(conClient.client===client));
        connections[i].clientData.score += score;
        console.log("ClientId " + connections[i].clientData.clientId + " scored " + score);

     });

     client.on('SELECT_TEAM', function(data){
        var i = connections.findIndex((conClient)=>(conClient.clientData.clientId===data.clientId));
        connections[i].clientData.type = data.team;
        connections[i].client.emit("TEAM_SELECTED", connections[i].clientData.type);
        console.log("ClientId " + connections[i].clientData.clientId + " joined " + connections[i].clientData.type + "team");
     });

     client.on('EVERYBODY_READY', function(){
        selectConductor();
     });

     client.on('CONDUCTOR_READY', function(){
        var d = new Date();
        var seconds = d.getSeconds() + 10;
        d = d + seconds;
        for(var i = 0; i<connections.length; i++)
        {
            connections[i].client.emit("GAME_START", {"clientData":connections[i].clientData, "startTime":  d});
        }
        console.log("Conductor set game to start at: " + d);
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
            console.log("ClientId " + connections[i].clientData.clientId + " set as conductor");
    
            
        }
        else
        {
            connections[i].clientData.type = "MUSICIAN";
            connections[i].client.emit("MUSICIAN_SETUP");
            console.log("ClientId " + connections[i].clientData.clientId + " set as musician");
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