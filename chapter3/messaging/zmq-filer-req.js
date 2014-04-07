"use strict";
const
    zmq = require('zmq'),
    filename = process.argv[2],
    //create request endpoint
    requester = zmq.socket('req');

//handle replies
requester.on("message", function(data) {
    console.log(data)
    let response = JSON.parse(data);
    console.log("Received response:", response);
    requester.close()
});

requester.connect("tcp://localhost:5433");

//send request
console.log("Sending request for '" + filename);
requester.send(JSON.stringify({
    path: filename
}));