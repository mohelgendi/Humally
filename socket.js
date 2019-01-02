module.exports = function (server) {
    let returnObject = { socketUsers : {} };
    console.log('Socket connection has been established  successfully.' );

    let io = require('socket.io')(server);

    io.on('connection', function(socket){
        let uid = socket.handshake.query.uid;
        if(returnObject.socketUsers[uid] == undefined) returnObject.socketUsers[uid] = [];

        returnObject.socketUsers[uid].push(socket.id);
        console.log('a user ('+uid+ ' ' + socket.id +') connected ' + (new Date()));

        console.log('activeusers connect')
        console.log(returnObject.socketUsers);

        socket.on('disconnect', function(){
            console.log(this.id);
            console.log(this.handshake.query.uid);
            if(returnObject.socketUsers[this.handshake.query.uid] != undefined)
            {
                var index = returnObject.socketUsers[this.handshake.query.uid].indexOf(this.id);
                if (index > -1) {
                    returnObject.socketUsers[this.handshake.query.uid].splice(index, 1);
                    console.log('user disconnected ' + this.handshake.query.uid + ' ' + this.id + ' ' + (new Date()));
                }
                else {
                    console.log('user couldnt disconnected ' + this.handshake.query.uid + ' ' + this.id);
                }
                console.log('activeusers disconnect')
                console.log(returnObject.socketUsers);
            }
        });
    });
    returnObject.io = io;
    returnObject.emitSpecificUser= function(uid, listenerName, callbackData){
        console.log('activeusers emit')
        console.log(returnObject.socketUsers);
        if(returnObject.socketUsers[uid] != undefined){
            for(let q = 0; q < returnObject.socketUsers[uid].length; q++){
                returnObject.io.to(returnObject.socketUsers[uid][q]).emit(listenerName, callbackData)
            }
            return true;
        }
        return false;
    }
    returnObject.emit= function(listenerName, callbackData){
        returnObject.io.emit(listenerName, callbackData)
    }
    return returnObject;
}




/*
console.log('socket');
var io = require('socket.io')(3002, {
    path: '/test',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
});

console.log('socket');
io.on('connection', function(socket){
    let token = socket.handshake.query.token;
    io.to(socket.id).emit("getSomeData", {data : 'hey'+socket.id})
    console.log(socket.id);
    console.log('a user connected');

    socket.on('disconnect', function(){
        console.log(this.id);
        console.log('user disconnected');
    });

    socket.on('chat message', function(msg){
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

*/


