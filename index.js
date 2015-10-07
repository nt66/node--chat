var express         = require('express');
var path            = require('path');
var ejs             = require('ejs');
var config          = require('config');
var bodyParser      = require('body-parser');
var app             = express();
var server          = require('http').createServer(app);
var io              = require('socket.io').listen(server);

var client = {};
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',function (req,res) {
  res.render('login',{alarm:''});
});

app.post('/login',function (req,res) {
  if(config.has(req.body.name)){
    var userInfo = config.get(req.body.name);
    if(userInfo.pwd == req.body.pwd){
      client['name'] = req.body.name;
      client['rname'] = userInfo.name;
      client['id'] = userInfo.id;
      client['icon'] = userInfo.icon
      res.redirect('/chat');
    }
    else{
      res.render('login',{alarm:'用户名或密码错误'});
    }
  }else{
  	res.render('login',{alarm:'用户名或密码错误'});
  }
});

app.get('/chat',function (req,res) {
	res.render('chat',{title:'聊天室',client:client});
});

io.on('connection', function (socket) {
  socket.on('newuser',function() {
    var data = {
      name:client['rname']||'',
      type:'welcome'
    };
    if(data.name){
	  socket.emit('system',data);
	  socket.broadcast.emit('system',data);
    }
  });

  //发送消息监听
  socket.on('message',function(msg){
    var data ={
     id:client.id,
     name:client.name,
     rname:client.rname,
     icon:client.icon,
     msg:msg
    };
    socket.emit('message',data);
    socket.broadcast.emit('message',data);
  });

});

// //时间
// var getTime=function(){
//   var date = new Date();
//   return date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
// }


server.listen('8081',function(){
  console.log('--------socket listening--------');
});
