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
var gameInProgress = false;

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
                    "numberOfHits" : 0,
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
            while(!vipFound && vipIndex < connections.length)
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
            if(!vipFound){
                gameInProgress = false;
            }          
        }
        if(connections.length === 0)
        {
            gameInProgress = false;
        }
     });

     client.on('REGISTER_USERNAME', function(username){
        if(!gameInProgress)
        {
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
    }
     });

     client.on('REGISTER_SCORE', function(score){
        var i = connections.findIndex((conClient)=>(conClient.client===client));
        connections[i].clientData.score += score;
        connections[i].clientData.numberOfHits++;
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
        gameInProgress = true;
     });

     client.on('CONDUCTOR_READY', function(difficulty){
        var d = new Date();
        d.setSeconds(d.getSeconds() + 10);
        for(var i = 0; i<connections.length; i++)
        {
            connections[i].client.emit("GAME_START", {"clientData":connections[i].clientData, "startTime":  d, songId: difficulty});
        }
        console.log("Conductor set game to start at: " + d + "with a difficulty of " + difficulty);
     });

     client.on('CONDUCTOR_SONG_FINISHED', function(){
        for(var i = 0; i<connections.length; i++)
        {
            connections[i].client.emit("GAME_OVER");
            console.log("GAME OVER");
        }
     });

     client.on('REQUEST_SCORE', function(){
        var redScore = 0;
        var greenScore = 0;
        var blueScore = 0;

        var redPercentage = 0;
        var greenPercentage = 0;
        var bluePercentage = 0;

        var redPlayers = 0;
        var bluePlayers = 0;
        var greenPlayers = 0;

        for(var i = 0; i<connections.length; i++)
        {
            if(connections[i].clientData.type !== "CONDUCTOR")
            {
                if(connections[i].clientData.type === "RED")
                {
                    redScore += connections[i].clientData.score;
                    redPercentage += connections[i].clientData.score/connections[i].clientData.numberOfHits;
                    redPlayers++;
                }
                if(connections[i].clientData.type === "BLUE")
                {
                    blueScore += connections[i].clientData.score;
                    bluePercentage += connections[i].clientData.score/connections[i].clientData.numberOfHits;
                    bluePlayers++;
                }
                if(connections[i].clientData.type === "GREEN")
                {
                    greenScore += connections[i].clientData.score;
                    greenPercentage += connections[i].clientData.score/connections[i].clientData.numberOfHits;
                    greenPlayers++;
                }
            }
        }

        vipIndex = connections.findIndex((conClient)=>(conClient.clientData.isVip));
        if(vipIndex === -1)
        {
            if(connections.length >= 1)
            {
            var vipIn = 0;
            var vipFound = false;
            while(!vipFound && vipIn < connections.length)
            {
                if(connections[vipIn].clientData.username !== "")
                {
                    vipFound = true;
                    connections[vipIn].clientData.isVip = true;
                    client.emit("NEW_VIP", {"vip": true});
                    console.log('New VIP Chosen: ClientId ' + connections[vipIn].clientData.clientId);
                }
                
                    vipIn++;
                
            }  
            if(!vipFound)
            {
                gameInProgress = false;
            }        
        }
        }
        else if(client === connections[vipIndex].client)
        {
            client.emit("NEW_VIP", {"vip": true});
            console.log("End Game VIP selected");
        }

        var playerIndex = connections.findIndex((conClient)=>(conClient.client===client));

        if(redPlayers === 0)
        {
            redScore=0;
            redPercentage=0;
        }
        else{
            redScore=redScore/redPlayers;
            redPercentage=redPercentage/redPlayers;
        }

        if(greenPlayers === 0)
        {
            greenScore=0;
            greenPercentage=0;
        }
        else{
            greenScore=greenScore/greenPlayers;
            greenPercentage=greenPercentage/greenPlayers;
        }

        if(bluePlayers === 0)
        {
            blueScore=0;
            bluePercentage=0;
        }
        else{
            blueScore=blueScore/bluePlayers;
            bluePercentage=bluePercentage/bluePlayers;
        }




        if(connections[playerIndex].clientData.type === "CONDUCTOR")
        {
            var conductorPlayerScore = 0;
            var conductorPlayerPercentage = 0;

            if(redPlayers >= 1 || bluePlayers >= 1 || greenPlayers >= 1 )
            {
                conductorPlayerScore = (redScore + blueScore + greenScore)/(redPlayers + bluePlayers + greenPlayers);
                conductorPlayerPercentage =  (redPercentage + bluePercentage + greenPercentage)/(redPlayers + bluePlayers + greenPlayers);
            }   

            client.emit("FINAL_SCORE",{
                "playerScore": conductorPlayerScore,
                "playerPercentage":conductorPlayerPercentage,
                redScore,
                greenScore,
                blueScore,
                redPercentage,
                bluePercentage,
                greenPercentage             
            });
        }
        else{
            client.emit("FINAL_SCORE",{
                "playerScore": connections[playerIndex].clientData.score,
                "playerPercentage":connections[playerIndex].clientData.score/connections[playerIndex].clientData.numberOfHits,
                redScore,
                greenScore,
                blueScore,
                redPercentage,
                bluePercentage,
                greenPercentage            
            });
        }

        console.log("Final Scores Sent");
     });

     client.on('REQUEST_RESTART', function(){
        for(var i = 0; i<connections.length; i++)
        {
            connections[i].client.emit("RESTART_GAME");
            console.log("GAME OVER FOOLS!");
            gameInProgress = false;
        }
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