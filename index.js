var express = require('express');
var path    = require('path');
var ejs     = require('ejs');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.get('/',function (req,res) {
  res.render('chat',{title:'聊天室'});
});


io.on('connection', function (socket) {
  
});

server.listen('8081',function(){
  console.log('--------socket listening--------');
});
