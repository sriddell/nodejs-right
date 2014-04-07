'use strict';
const
    fs = require('fs'),
    zmq = require('zmq');

//master process - create ROUTER and DEALER sockets and bind endpoints
let
    router = zmq.socket('router').bind('tcp://127.0.0.1:5433'),
    dealer = zmq.socket('dealer').bind('tcp://127.0.0.1:5444');

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


