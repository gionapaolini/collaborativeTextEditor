"use strict";

let express = require('express');
let WebSocketServer = require('websocket').server;
let http = require('http');
let app = express();
let clients = [];


app.set('view engine', 'ejs');
app.use('/assets',express.static('assets'));
app.get('/', function(req,res) {
        res.render('index');
});


let server = http.createServer(app);
server.listen(process.env.PORT || 5000, () => {
    console.log(`Server started on port ${server.address().port} :)`);
});

// create the server
var wsServer = new WebSocketServer({
  httpServer: server
});



// WebSocket server
wsServer.on('request', function(request) {

  console.log((new Date()) + ' Connection from origin ' + request.origin + '.');
  var connection = request.accept(null, request.origin);
  clients.push(connection);
  console.log((new Date()) + ' Connection accepted.');


  connection.on('message', function(message) {
    if (message.type === 'utf8') {

      let dataMessage = JSON.parse(message.utf8Data);
      var json = JSON.stringify(dataMessage);

      for (var i=0; i < clients.length; i++) {
        if(clients[i]===this)
          continue;
        clients[i].sendUTF(json);
      }

    }
  });

  connection.on('close', function(connection) {
    let index = clients.indexOf(this);
    clients.splice(index, 1);
    console.log((new Date()) + " Peer disconnected.");
  });
});
