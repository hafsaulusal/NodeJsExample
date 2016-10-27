var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
users=[];
connections=[];

server.listen(process.env.PORT||8600);
console.log('server running..');

app.get('/',function(req,res){
	res.sendFile(__dirname +'/index.html');
});

io.sockets.on('connection',function(socket){
	connections.push(socket);
	console.log('Connected:%s sockets connected',connections.length);
	
	//disconnet
	socket.on('disconnet',function(data){
		//if(!socket.user) return;
		users.splice(users.indexOf(socket.user),1);
		UpdateUser();
	connections.splice(connections.indexOf(socket),1);
	console.log('Disconnected:%s sockets connected',
	connections.length);
	});
	
	//Send Message
	socket.on('send message',function(data){
		io.sockets.emit('new message',{msg:data,usern:socket.user});
	});
	
	//New User
	socket.on('new user',function(data,callback){
		callback(true);
		socket.user=data;
		users.push(socket.user);
		UpdateUser();
	})
	
	function UpdateUser(){
		io.sockets.emit('get users',users);
	}
	
});


