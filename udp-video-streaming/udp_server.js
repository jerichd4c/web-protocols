const dgram = require('dgram');
const fs = require('fs');
const path = require('path');

const server = dgram.createSocket('udp4');
const VIDEO_DIR = path.join(__dirname, 'videos');

// 32768 bytes is a safe size for UDP chunks
const CHUNK_SIZE = 32768;

// Manual ACK variable to control promises
let resolveAck = null;

server.on('message', async (msg, rinfo) => {
    const command = msg.toString().trim();

    if (command === 'ACK') {
        if (resolveAck) {
            resolveAck();
            resolveAck = null;
        }
        return;
    }

    console.log(`Comando recibido: ${command} desde ${rinfo.address}:${rinfo.port}`);

    if (command === 'LIST') {
        // Get mp4 files 
        fs.readdir(VIDEO_DIR, (err, files) => {
            if (err) return;
            const mp4Files = files.filter(f => f.endsWith('.mp4'));
            const response = Buffer.from(JSON.stringify(mp4Files));
            server.send(response, rinfo.port, rinfo.address);
        });
    } else if (command.startsWith('GET')) {
        // Stream requested video
        const filename = command.split(' ')[1];
        const filePath = path.join(VIDEO_DIR, filename);

        if (fs.existsSync(filePath)) {
            const readStream = fs.createReadStream(filePath, { highWaterMark: CHUNK_SIZE });

            // Wraps UDP and sends it through promise
            const sendChunkAsync = (data) => {
                return new Promise((resolve, reject) => {
                    server.send(data, rinfo.port, rinfo.address, (err) => {
                        if (err) {
                            console.error("Error en red:", err);
                            reject(err);
                        } else {
                            resolveAck = resolve;
                        }
                    });
                }); 
            };

            try {
                for await (const chunk of readStream) {
                    await sendChunkAsync(chunk);
            }
            await sendChunkAsync(Buffer.from('EOF'));
            console.log(`Transmisión de ${filename} finalizada.`);
        } catch (error) {
            console.error(`Transmision interrumpida: ${error.message}`);
            }
        }
    } else {
        console.error(`Archivo no encontrado: ${filename}`);
    }
});


server.on('listening', () => {
    const address = server.address();
    console.log(`Servidor UDP de Video escuchando en ${address.address}:${address.port}`)
});

server.bind(41234);