const express = require('express');
const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// FTP session variables
let client = new ftp.Client();
// Logs: on
client.ftp.verbose = true; 

// Read local files
const LOCAL_FILES = path.join(__dirname, 'local_files');
if (!fs.existsSync(LOCAL_FILES)) {
    fs.mkdirSync(LOCAL_FILES);
}

// Set routes (connect/disconnect)
app.post('/api/connect', async (req, res) => {
    const { host, port, user, password } = req.body;

    try {
        await client.access({
            host: host,
            port: parseInt(port) || 21,
            user: user,
            password: password, 
            // Set this to true if using FileZilla, false if using IIS
            secure: false,
            secureOptions: {
                rejectUnauthorized: false
            }
        });
        res.json({ success: true, message: `Conectado exitosamente a ${host}`});
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error de conexion: ' + error.message });
    }
});

app.post('/api/disconnect', (req, res) => {
    if (client && !client.closed) {
        client.close();
        res.json({ success: true, message: 'Desconectado del servidor FTP.' });
    } else {
        res.json({ success: false, message: 'No hay ninguna conexion activa.' });
    }
});

// List local files
app.get('/api/local_files', (req, res) => {
    try {
        // Read local_files content
        const files = fs.readdirSync(LOCAL_FILES);
        res.json({ success: true, files });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error leyendo local: ' + error.message });
    }
});

// List remote files (2nd PC)
app.get('/api/remote_files', async (req, res) => {
    if (!client || client.closed) {
        return res.status(400).json({ success: false, message: 'No hay conexion activa.' });
    }
    try {
        // Bring files from FTP server
        const list = await client.list();

        const files = list.map(files => files.name);
        res.json({success: true, files });

    } catch (error) {
        res.status(500).json({ success: false, message: 'Error leyendo directorio remoto: ' + error.message });
    }
});

// Upload file
app.post('/api/upload', async (req, res) => {
    const {fileName} = req.body;

    // Verify client is still up
    if (!client || client.closed) {
        return res.status(400).json({ success: false, message: 'No hay conexion activa.' });
    }

    // Get local file 
    const localRoute = path.join(LOCAL_FILES, fileName);

    try {
        // Upload local file to server
        await client.uploadFrom(localRoute, fileName);
        res.json({ success: true, message: `Archivo '${fileName}' subido exitosamente.` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error subiendo archivo: ' + error.message });
    }
});

// Download file (copy remote -> local, no need to read it back)
app.post('/api/download', async (req, res) => {
    try {
        const { fileName } = req.body;

        if (!client || client.closed) {
            return res.status(400).json({ success: false, message: 'No hay conexion activa.' });
        }

        const localRoute = path.join(LOCAL_FILES, fileName);

        // Download remote file to local_files
        await client.downloadTo(localRoute, fileName);

        res.json({ success: true, message: `Archivo '${fileName}' descargado exitosamente.` });
    } catch (error) {
        console.error("Error descargando:", error);
        res.status(500).json({ success: false, message: 'Error al descargar archivo: ' + error.message });
    }
});

// Download a remote file and return its content, for editing in the browser
app.post('/api/download_edit', async (req, res) => {
    try {
        const { fileName } = req.body;

        if (!client || client.closed) {
            return res.status(400).json({ success: false, message: 'No hay conexion activa.' });
        }

        const localRoute = path.join(LOCAL_FILES, fileName);

        // Download remote file to local_files
        await client.downloadTo(localRoute, fileName);

        // Read file content (format: utf8)
        const content = fs.readFileSync(localRoute, 'utf8');

        // Send text to frontend (app.js)
        res.json({ success: true, content: content });
    } catch (error) {
        console.error("Error descargando para edicion:", error);
        res.status(500).json({ success: false, message: 'Error al descargar/leer archivo: ' + error.message });
    }
});

// Update remote file
app.post('/api/update_remote', async (req, res) => {
    try {
        const { fileName, content } = req.body;
        if (!client || client.closed) return res.status(400).json({ success: false, message: 'Sin conexion.' });

        const localRoute = path.join(LOCAL_FILES, fileName);
        fs.writeFileSync(localRoute, content, 'utf8');
        // Overwrite server file
        await client.uploadFrom(localRoute, fileName);
        res.json({ success: true, message: `Archivo remoto '${fileName}' actualizado.` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error actualizando remoto: ' + error.message });
    }
});

// Read local files
app.post('/api/read_local', (req, res) => {
    try {
        const { fileName } = req.body;
        const localRoute = path.join(LOCAL_FILES, fileName);
        const content = fs.readFileSync(localRoute, 'utf8');
        res.json({ success: true, content });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error leyendo local: ' + error.message });
    }
});

// Update local files
app.post('/api/update_local', (req, res) => {
    try {
        const { fileName, content } = req.body;
        const localRoute = path.join(LOCAL_FILES, fileName);
        fs.writeFileSync(localRoute, content, 'utf8');
        res.json({ success: true, message: `Archivo local '${fileName}' guardado.` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error guardando local: ' + error.message });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Cliente FTP corriendo en http://localhost:${PORT}`);
});