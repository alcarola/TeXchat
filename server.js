var express = require('express');
var socketio = require('socket.io');
var klass = require('klass');
var _ = require('underscore');

var app = express.createServer();
var io = socketio.listen(app);

app.listen(8080);


// require.js
var requirejs = require('requirejs');

requirejs.config({
  //Pass the top-level main.js/index.js require
  //function to requirejs so that node modules
  //are loaded relative to the top-level JS file.
  nodeRequire: require
});



// routing
app.configure(function() {
  app.use(express.methodOverride());
  app.use(express.bodyParser());
  app.use(app.router);
});

app.configure(function() {
  app.use(express.static(__dirname + '/public'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


app.get('/room/:room', function (req, res) {
  req.url = '/';
  req.next();
  // res.redirect('/#' + req.url);
});



// chat stuff.

var chat = io.of('/chat');
var users = {};

chat.on('connection', function (socket) {

  var user = { name: '', room: undefined};
  users[socket.id] = user;

  // change name
  socket.on('setName', function(name) {

    var oldname = user.name;
    user.name = name;
    if (user.room) {
      chat.in(user.room)
          .emit('rename', user.room, oldname, name);
    }

  });

  function leaveRoom() {
    // leave previous room
    if (user.room) {

      socket.leave(user.room);
      chat.in(user.room)
          .emit('userParted', user.room, user.name);
      user.room = undefined;

    }
  }


  // join a room
  socket.on('joinRoom', function(roomname) {

    if (user.room)
      leaveRoom();


    user.room = roomname;
    socket.join(roomname);
    socket.emit('joinedRoom', roomname);

    chat.in(user.room)
        .emit('userJoined', roomname, user.name);
  });

  // send room info
  socket.on('roomInfo', function(roomname) {
    var usernames = _(chat.manager.rooms['/chat/' + roomname] || [])
                    // .filter(function(s) { return s != socket.id; })
                    .map(function(s) { return users[s].name; });

    socket.emit('roomInfo', roomname, {name: roomname, users: usernames});
  });

  // join a room
  socket.on('partRoom', function(roomname) {
    leaveRoom();
  });


  // message
  socket.on('chatMessage', function(roomname, message) {
    if (roomname != user.room) {
      console.log(new Error('Attempting to broadcast to channel not in.'));
      socket.emit('resync');
      return;
    }

    // console.log(roomname + ' saw ' + message);
    message.date = new Date().toISOString().replace('T', ' ').split('.')[0];
    chat.in(roomname).emit('chatMessage', roomname, message);
  });


	// when the user disconnects.. perform this
	socket.on('disconnect', function() {

    // leave room.
    leaveRoom(socket);

	});
});