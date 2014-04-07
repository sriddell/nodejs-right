'use strict';
const
    cluster = require('cluster'),
    fs = require('fs'),
    zmq = require('zmq');

if (cluster.isMaster) {
    //master process - create ROUTER and DEALER sockets and bind endpoints
    let
        router = zmq.socket('router').bind('tcp://127.0.0.1:5433'),
        dealer = zmq.socket('dealer').bind('ipc://filer-dealer.ipc');

    //forward messages between router and dealer
    router.on('message', function() {
        let frames = Array.prototype.slice.call(arguments);
        console.log('router handling frames')
        dealer.send(frames);
    });

    dealer.on('message', function() {
        let frames = Array.prototype.slice.call(arguments);
        console.log('dealer handling frames');
        router.send(frames);
    });

    //listen for workers
    cluster.on('online', function(worker) {
        console.log('Worker ' + worker.process.pid + ' is online.');
    });

    //start 3 workers
    for (let i=0; i < 3; i++) {
        cluster.fork();
    }
} else {
    //worker process - create REP socket, connect to DEALER
    let responder = zmq.socket('rep').connect('ipc://filer-dealer.ipc');

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
}