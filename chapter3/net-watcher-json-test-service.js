"use strict";
const
    net = require('net'),

    server = net.createServer(function(connection) {
        console.log('Subscriber connected');

        // send the first chunk immediately

        connection.write(
            '{"type":"changed", "file":"targ'
        );

        // send other chunk after 1 second
        let timer = setTimeout(function() {
            connection.write('et.txt", "timestamp":1358175758495}' + "\n");
            connection.end();
        }, 1000);

        //clear timer on connection end
        connection.on('end', function() {
            clearTimeout(timer);
            console.log('Subscriber disconnected');
        });


    });

server.listen(5432, function() {
    console.log('Test server listening for subscribers...')
});