const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));
var PORT = process.env.PORT || 8000;

app.get('/', function(req, resp){
    resp.render('index.html');
});

io.on('connection', function(client){
    console.log("one user connected");
    
    client.on('disconnect', function(){
        console.log("A user disconnected");
    });
    client.on('draw', function(data) {
       client.broadcast.emit('draw', data); 
    });
    
});

http.listen(PORT, function(){
    console.log("App starts at port " + PORT);
});