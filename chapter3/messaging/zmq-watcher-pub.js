'use strict';
const
    fs = require('fs'),
    zmq = require('zmq'),

    //create publisher endpoint
    publisher = zmq.socket('pub'),

    filename = process.argv[2];

fs.watch(filename, function() {
    //send message to subscribers
    publisher.send(JSON.stringify({
        type: 'changed',
        file: filename,
        timestamp: Date.now()
    }));
});

publisher.bind('tcp://*:5432', function(err) {
    console.log('Listening for zmq subscribers...');
});