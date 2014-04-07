'use strict';
const
    fs = require('fs'),
    zmq = require('zmq'),
    responder = zmq.socket('rep').connect('tcp://127.0.0.1:5444');

responder.on('message', function(data) {
    //parse incoming
    let request = JSON.parse(data);
    console.log(process.pid + ' received request for: ' + request.path);
    //read file and reply
    fs.readFile(request.path, function(err,data) {
        console.log(process.pid + " sending response");
        responder.send(JSON.stringify({
            pid: process.pid,
            data: data.toString(),
            timestamp: Date.now()
        }));
    });
});
