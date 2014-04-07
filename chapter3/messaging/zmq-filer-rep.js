'use strict';
const
    fs = require('fs'),
    zmq = require('zmq'),
    //socket to reply
    responder = zmq.socket('rep');

//handle request
responder.on('message', function(data) {
    let request = JSON.parse(data);
    console.log('Received request to get: ' + request.path);

    //read file, reply with content
    fs.readFile(request.path, function(err, content) {
        console.log('Sending response content');
        responder.send(JSON.stringify({
            content: content.toString(),
            timestamp: Date.now(),
            pid: process.pid
        }));
    });
});

responder.bind('tcp://*:5433', function(err) {
    console.log('Listening for zmq requesters...');
});

//close the responder when Node process ends
process.on('SIGINT', function() {
    console.log('Shutting down...');
    responder.close();
});