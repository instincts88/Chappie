var app = require('express')();
var http = require ('http').createServer(app);
var io = require('socket.io')(http);
users = {};
connections = [];

app.get('/', function(req, res){
   res.sendFile(__dirname + '/final.html');
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s user(s) connected', connections.length);
    
    //Disconnected sockets
    socket.on('disconnect', function(data){
        if(!socket.username) return;
        delete users[socket.username]
        //users.splice(users.indexOf(socket.username), 1);
        updateUsernames();

        connections.splice(connections.indexOf(socket), 1)
        console.log('Connected: %s user(s) connected', connections.length);    
    });
    
    socket.on('send message', function(data, callback){
        var msg = data.trim();
        if (msg.substr(0,1)==='@'){
            msg = msg.substr(1);
            var ind = msg.indexOf(' ');
            if(ind!== -1){
                var name = msg.substring(0, ind);
                var msg = msg.substring(ind + 1);
                if(name in users){
                    users[name].emit('whisper', {msg:msg, users:socket.username})
                    console.log('whisper');
                }else{
                    callback('User does not exist');
                }
                
            }else{
                console.log("Not a Whisper");
            }
            
        }else{
        io.sockets.emit('new message', {msg:msg, users:socket.username});
        }
    });

    //new user
    socket.on('new user', function(data, callback){
        if (data in users){
            callback(false);
        }else{
            callback(true);
            socket.username = data;
            users[socket.username] = socket;
           // users.push(socket.username);
            updateUsernames();
        }
    });

    function updateUsernames(){
        io.sockets.emit('get users', Object.keys(users));
    }
});

http.listen(3000, function(){
    console.log('Server up and running......');
});