#!/usr/bin/env node
const WebSocketServer = require('websocket').server;
const http = require('http');
const nstatic = require('node-static');

const fileServer = new nstatic.Server('./public');

const server = http.createServer(function(req, res) {
    console.log(new Date() + ' Received request for ' + req.url);
    req.addListener('end', function() {
        fileServer.serve(req, res);
    }).resume();
});

server.listen(3000, function() {
    console.log(new Date() + ' Server is listening on port 3000');
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

let connAry = [];

function originIsAllowed(origin) {
    console.log(origin);
    return true;
}

wsServer.on('request', function(req) {
    if (!originIsAllowed(req.origin)) {
        req.reject();
        console.log(new Date() + ' Connection from origin ' + req.origin + ' rejected.');
        return;
    }
    const conn = req.accept('echo-protocol', req.origin);
    connAry.push(conn);
    console.log(new Date() + ' Connection accepted.');
    conn.on('close', function(reasonCode, description) {
        console.log(new Date() + ' Peer ' + conn.remoteAddress + ' disconnected.');
    });
    conn.on('message', function(message) {
        console.log('Received Message: ' + message.utf8Data);
        connAry.forEach(elm => {
           elm.sendUTF(message.utf8Data); 
        });
    });
});