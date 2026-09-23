let selectedLocalFile = null;
let selectedRemoteFile = null;
let editMode = null;

// Buttons
const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const summitBtn = document.getElementById('summitBtn');
const closeEditorBtn = document.getElementById('closeEditorBtn');
const editLocalBtn = document.getElementById('editLocalBtn');
const editRemoteBtn = document.getElementById('editRemoteBtn');
const downloadBtn = document.getElementById('downloadBtn');
const saveEditorBtn = document.getElementById('saveEditorBtn');

// Div elements
const consoleUI = document.getElementById('console');
const editorSection = document.getElementById('editorSection');
const fileEditor = document.getElementById('fileEditor');
const editingFileName = document.getElementById('editingFileName');

// Add messages to log console
function logMessage(message) {
    consoleUI.value += `> ${message}\n`;
    consoleUI.scrollTop = console.scrollHeight;
}

// Connect event
connectBtn.addEventListener('click', async () => {
    const host = document.getElementById('host').value;
    const port = document.getElementById('port').value;
    const user = document.getElementById('user').value;
    const password = document.getElementById('password').value;

    logMessage(`Intentando conectar a ${host}:${port}...`);

    try {
        const response = await fetch('/api/connect', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ host, port, user, password })
        });

        const data = await response.json();

        if (data.success) {
            logMessage(data.message);
            connectBtn.disabled = true;
            disconnectBtn.disabled = false;
            getLocalFiles();
            getRemoteFiles();

        } else {
            logMessage(`Error: ${data.message}`);
        }
    } catch (error) {
        logMessage(`Error de red: ${error.message || error}`);

    }
});

// Disconnect event 
disconnectBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/disconnect', { method: 'POST' });
        const data = await response.json();

        logMessage(data.message);
        connectBtn.disabled = false;
        disconnectBtn.disabled = true;
    } catch (error) {
        logMessage(`Error al desconectar: ${error.message || error}`);
    }
});

// Summit file event
summitBtn.addEventListener('click', async () => {
    if (!selectedLocalFile) return;
    logMessage(`Uploading ${selectedLocalFile}...`);
    summitBtn.disabled = true;

    try {
        const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: selectedLocalFile })
        });
        const data = await res.json();

        if (data.success) {
            logMessage(data.message);
            getRemoteFiles(); // Upload remote list
        } else {
            logMessage(`Error: ${data.message}`);
        }
    } catch (error) {
        logMessage(`Error de red: ${error.message}`);
    }
    summitBtn.disabled = false;
});

// Edit local file event
editLocalBtn.addEventListener('click', async () => {
    if (!selectedLocalFile) return;
    logMessage(`Descargando ${selectedLocalFile} para edicion...`);
    editMode = 'local';

    try {
        const res = await fetch('/api/read_local', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: selectedLocalFile })
        });
        const data = await res.json();

        if (data.success) {
            // Show textbox
            editorSection.style.display = 'block';
            editingFileName.textContent = selectedLocalFile;
            fileEditor.value = data.content;

            // Allow update button
            saveEditorBtn.disabled = false;
            logMessage(`Listo para editar: ${selectedLocalFile}`);
        } else {
            logMessage(`Error: ${data.message}`);
        }
    } catch (error) {
        logMessage(`Error de red: ${error.message}`);
    }
    editBtn.disabled = false;
});

// Edit remote file event
editRemoteBtn.addEventListener('click', async () => {
    if (!selectedRemoteFile) return;
    logMessage(`Descargando ${selectedRemoteFile} para edicion...`);
    editMode = 'remote';

    try {
        const res = await fetch('/api/download_edit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: selectedRemoteFile })
        });
        const data = await res.json();

        if (data.success) {
            // Show textbox
            editorSection.style.display = 'block';
            editingFileName.textContent = selectedRemoteFile;
            fileEditor.value = data.content;

            // Allow update button
            saveEditorBtn.disabled = false;
            logMessage(`Listo para editar: ${selectedRemoteFile}`);
        } else {
            logMessage(`Error: ${data.message}`);
        }
    } catch (error) {
        logMessage(`Error de red: ${error.message}`);
    }
    editRemoteBtn.disabled = false;
});

// Download file event
downloadBtn.addEventListener('click', async () => {
    if (!selectedRemoteFile) return;
    logMessage(`Descargando ${selectedRemoteFile} a sitio local...`);
    downloadBtn.disabled = true;

    try {
        const res = await fetch('/api/download', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileName: selectedRemoteFile })
        });
        const data = await res.json();

        if (data.success) {
            logMessage(`Archivo '${selectedRemoteFile}' descargado exitosamente.`);
            getLocalFiles(); // Refresh local list
        } else {
            logMessage(`Error: ${data.message}`);
        }
    } catch (error) {
        logMessage(`Error de red: ${error.message}`);
    }
    downloadBtn.disabled = false;
});

// Close editor event
closeEditorBtn.addEventListener('click', () => {
    editorSection.style.display = 'none';
    fileEditor.value = '';
    saveEditorBtn.disabled = true;
    editMode = null;
});

// Update local file event
saveEditorBtn.addEventListener('click', async () => {
    saveEditorBtn.disabled = true;

    if (editMode === 'local') {
        logMessage(`Guardando cambios en ${selectedLocalFile}...`);

        try {
            const res = await fetch('/api/update_local', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: selectedLocalFile, content: fileEditor.value })
            });
            const data = await res.json();
            logMessage(data.message);
        } catch (error) {
            logMessage(`Error guardando: ${error.message}`);
        }
    } else if (editMode === 'remote') {
        logMessage(`Subiendo actualizaciones de ${selectedRemoteFile}...`);
        try {
            const res = await fetch('/api/update_remote', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ fileName: selectedRemoteFile, content: fileEditor.value })
            });
            const data = await res.json();
            logMessage(data.message);
            getRemoteFiles();
        } catch (error) {
            logMessage(`Error actualizando remoto: ${error.message}`);
        }
    }
    saveEditorBtn.disabled = false;
});

// Get local files
async function getLocalFiles() {
    const res = await fetch('/api/local_files');
    const data = await res.json();
    const container = document.getElementById('localList');
    // Clean list before fetching files
    container.innerHTML = '';

    if (data.success) {
        data.files.forEach(fileName => {
            const div = document.createElement('div');
            div.textContent = fileName;
            div.className = 'item-file';

            div.addEventListener('click', () => {
                // Only clear the selection highlight within the local panel,
                // so a remote selection (if any) stays highlighted too
                document.querySelectorAll('#localList .item-file').forEach(el => el.classList.remove('selected'));

                div.classList.add('selected');
                selectedLocalFile = fileName;

                // Enable local buttons; remote buttons are left untouched
                // so both a local and a remote file can be selected at once
                summitBtn.disabled = false;

                // Only supports .txt
                if (fileName.endsWith('.txt')) {
                    editLocalBtn.disabled = false;
                } else {
                    editLocalBtn.disabled = true;
                }
                logMessage(`Archivo local seleccionado: ${fileName}`);
            });
            container.appendChild(div);
        });
    }
}

// Get remote files
async function getRemoteFiles() {
    const res = await fetch('/api/remote_files');
    const data = await res.json();
    const container = document.getElementById('remoteList');
    // Clean list before fetching files
    container.innerHTML = '';

    if (data.success) {
        data.files.forEach(fileName => {
            const div = document.createElement('div');
            div.textContent = fileName;
            div.className = 'item-file';

            div.addEventListener('click', () => {
                // Only clear the selection highlight within the remote panel,
                // so a local selection (if any) stays highlighted too
                document.querySelectorAll('#remoteList .item-file').forEach(el => el.classList.remove('selected'));

                div.classList.add('selected');
                selectedRemoteFile = fileName;

                // Enable remote buttons; local buttons are left untouched
                // so both a local and a remote file can be selected at once
                downloadBtn.disabled = false;

                // Only supports .txt
                if (fileName.endsWith('.txt')) {
                    editRemoteBtn.disabled = false;
                } else {
                    editRemoteBtn.disabled = true;
                }
                logMessage(`Archivo remoto selecionado: ${fileName}`);
            });
            container.appendChild(div);
        });
    }
}