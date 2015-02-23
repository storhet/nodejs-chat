var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var colors = ['red', 'green', 'blue', 'yellow', 'orange'];

io.on('connection', function(client) {
  client.on('join', function(name) {
    console.log(name + ' joined the chat!');
    client.nickname = name;
    client.color = colors[Math.floor((Math.random() * 5))];
  });

	client.on('messages', function(message) {
    var nickname = client.nickname;
    var color = client.color;
    client.broadcast.emit('messages', {
      name: nickname,
      message: message,
      color: color
    });

    client.emit('messages', {
      name: nickname,
      message: message,
      color: color
    });
	});
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
})

server.listen(8080);