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
  //构造客户端对象
  var client = {
    socket:socket,
    name:false,
    color:getColor()
  };

  socket.on('newuser',function(msg) {
    var data = {
      time:getTime(),
      color:getColor(),
      name:msg.name,
      type:'welcome'
    };
    socket.emit('system',data);
    socket.broadcast.emit('system',data);
  });

  //发送消息监听
  socket.on('message',function(msg){
    var data ={
     time:getTime(),
     msg:msg
    };
    socket.emit('message',data);
    socket.broadcast.emit('message',data);
  });

});

//时间
var getTime=function(){
  var date = new Date();
  return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
}

//颜色
var getColor=function(){
  var colors = ['aliceblue','antiquewhite','aqua','aquamarine','pink','red','green',
                'orange','blue','blueviolet','brown','burlywood','cadetblue'];
  return colors[Math.round(Math.random() * 10000 % colors.length)];
}

server.listen('8081',function(){
  console.log('--------socket listening--------');
});
