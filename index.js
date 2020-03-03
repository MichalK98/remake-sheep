var express = require("express");

var PORT = 8000;
var app = express()
  .use(express.static("."))
  .listen(PORT);

const io = require('socket.io')(8080);

var connection_count = 0;
var player = {};
var players = [];

io.on('connection', socket => {
  connection_count++;
  console.log(connection_count);

  socket.on('disconnect', () => {
    connection_count--;
    console.log(connection_count);

    players = players.filter(function( obj ) {
      return obj.id !== socket.id;
    });
    console.log(players)
  });

  socket.on('join', () => {
    let player = {
      id: socket.id,
      name: "player",
      x: 200,
      y: -450
    };
    
    socket.emit('player', {
      ...player,
      isSelf: true
    });
    socket.broadcast.emit("player", {
      ...player
    });
    players.forEach(e => {
      socket.emit('player', {
        ...player
      });
    });
    players.push(player);
  });
});
















console.log("");
console.log("Now running on http://localhost:" + PORT + "/");
console.log("Press ctrl-c to stop");
console.log("");