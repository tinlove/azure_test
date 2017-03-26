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


// Azure;
var azure = require('azure');
var hubName = "test0424";
var connectionString = "AAAAxxXDrFE:APA91bE6OORLEBHesPyupARINGUqps2iIK6GVN67TcBbZrZ8LpBnuULqA0sUWN7Ag6Xk8dB1oUA4ilKJrncKga0tw37rkU_y47RBPkcha_XxUc7OGunapXkKzKF_PAG08L-cNS3NCImW";
var notificationhubService = azure.createNotificationHubService(hubName, connectionString);

// var io = require('socket.io').listen(server);
// io.sockets.on('connection',function(socket){
//     socket.emit('toclient',{msg:'Welcome!'});
//     notificationHubService.gcm.send(null, {data:{id:socket.id, message:'Welcome'}},function(error){
//         if(!error){
//             console.log('send');
//         }
//     });
//
//     // socket.emit('toclient',{msg:'Welcome !'});
//
//     socket.on('fromclient',function(data){
//         socket.broadcast.emit('toclient',data); // 자신을 제외하고 다른 클라이언트에게 보냄
//         socket.emit('toclient',data); // 해당 클라이언트에게만 보냄. 다른 클라이언트에 보낼려면?
//         console.log('Message from client :'+data.msg);
//     });
// });

var io = require('socket.io').listen(server);
io.sockets.on('connection',function(socket){
    socket.emit('toclient',{msg:'Welcome!'});
    notificationHubService.gcm.send(null, {data:{id:socket.id, message:'Welcome'}},function(error){
        if(!error){
            console.log('send');
        }
    });

    socket.on('fromclient',function(data){
        socket.broadcast.emit('toclient',data);
        socket.emit('toclient',data);
        console.log('Message from client :'+data.msg);

        if(!data.msg==""){
            notificationHubService.gcm.send(null, {data:{id:socket.id, message:data.msg}}, function(error){
                if(!error){
                    //notification sent
                    console.log('send');
                }
            });
        }
    })
});