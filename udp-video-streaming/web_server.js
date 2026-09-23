const http = require('http');
const dgram = require('dgram');
const fs = require('fs');
const path = require('path');

http.createServer((req, res) => {
    // UI endpoint
    if (req.url === '/') {
        fs.readFile(path.join(__dirname, 'index.html'), (err, content)  =>  {
            res.writeHead(200, { 'Content-Type': 'text/html'});
            res.end(content);
        });
    }
    // Delivers CSS
    else if (req.url === '/styles.css') {
        fs.readFile(path.join(__dirname, 'styles.css'), (err, content) => {
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.end(content);
        /*  */});
    }
    // Request video playlist by UDP
    else if (req.url === '/api/videos') {
        const client = dgram.createSocket('udp4');
        client.send(Buffer.from('LIST'), 41234, 'localhost');

        client.on('message', (msg) => {
            res.writeHead(200, { 'content-type': 'application.json'});
            res.end(msg);
            // Close socket once list is already received
            client.close()
        });
    }
    // Request specific video and stream it on browser 
    else if (req.url.startsWith('/video/')) {
        const filename = decodeURIComponent(req.url.split('/')[2]);
        const client = dgram.createSocket('udp4');

        res.writeHead(200, {'Content-Type': 'video/mp4'});
        client.send(Buffer.from(`GET ${filename}`), 41234, 'localhost');

        let socketClosed = false;

        client.on('message', (msg) => {
            // If video ends, close socket
            if (msg.toString() === 'EOF') {
                res.end();
                // Only If socket isnt closed
                if (!socketClosed) {
                    client.close();
                    socketClosed = true;
                }
            } else {
                // Stream chunks trough UDP from browser
                res.write(msg);
                client.send(Buffer.from('ACK'), 41234, 'localhost');
            } 
        });
        
        // If user closes browser, close UDP client
        req.on('close', () => {
            if (!socketClosed) {
                client.close()
                socketClosed = true;
            }
        });
    }
}).listen(3000, () => {
    console.log('Servidor Web Intermediario en http://localhost:3000');
});