var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var colors = ['red', 'green', 'blue', 'yellow', 'orange'];

var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

io.on('connection', function(client) {
  client.on('join', function(name) {
    console.log(name + ' joined the chat!');
    client.nickname = name;
    client.color = colors[Math.floor((Math.random() * 5))];
  });

  client.on('messages', function(message) {
    var nickname = client.nickname;
    var color = client.color;

    var message = {
      name: nickname,
      message: message,
      color: color
    };

    client.broadcast.emit('messages', message);
    client.emit('messages', message);
  });
});

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
})

server.listen(port, ipaddr);