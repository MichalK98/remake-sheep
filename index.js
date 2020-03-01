var express = require("express");

var PORT = 8000;
var app = express()
  .use(express.static("."))
  .listen(PORT);

const io = require('socket.io')(8080);

var connection_count = 0;
var player;
var players = [];
io.on('connection', socket => {
  connection_count++;

  socket.on('disconnect', () => {
    connection_count--;

    // Remove player from array
    players = players.filter(function( obj ) {
      return obj.id !== socket.id;
    });
  });

  socket.on('player_join', data => {
    player =  {
      id: socket.id,
      name: data.username
    }
    players.push(player);
    socket.broadcast.emit('player_joined', player);
  });

});
















console.log("");
console.log("Now running on http://localhost:" + PORT + "/");
console.log("Press ctrl-c to stop");
console.log("");