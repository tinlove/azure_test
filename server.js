var http = require('http');
var express = require('express');
var app = express();

// view engine setup
app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');


// static file setting
app.use(express.static('public'));

//route setup
var index = require('./routes/index');
app.use('/', index);

//port setup
var port = process.env.PORT || 3000;


var server = http.createServer(app);
server.listen(port);


// Azure
var azure = require('azure');
var hubName = "test0424";
var connectionString = "Endpoint=sb://test0424.servicebus.windows.net/;SharedAccessKeyName=DefaultFullSharedAccessSignature;SharedAccessKey=X5fO27+x74clY8OhuTCdUnLgwNhOD9KlLgV8GlWaRlI=";
var notificationhubService1 = azure.createNotificationHubService(hubName, connectionString);

var io = require('socket.io').listen(server);
io.sockets.on('connection',function(socket){
    socket.emit('toclient',{msg:'Welcome!'});

    notificationhubService1.gcm.send(null, {data:{id:socket.id, message:'Welcome'}},function(error){
        if(!error){
            console.log('send');
        }
    });

    socket.on('fromclient',function(data){
        socket.broadcast.emit('toclient',data);
        socket.emit('toclient',data);
        console.log('Message from client :'+data.message);

        if(data.message != ""){
            notificationhubService1.gcm.send(null, {data:{id:socket.id, message:data.message}}, function(error){
                if(!error){
                    //notification sent
                    console.log('send');
                }
            });
        }
    })
});