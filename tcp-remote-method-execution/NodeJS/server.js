const net = require('net');
const fs = require('fs');
const path = require('path');

// Import available classes
const instances = {};
const classRoute = path.join(__dirname, 'classes');

// Reads all the javascript files in the 'classes' folder
fs.readdirSync(classRoute).forEach(file => {
    // Only reads JS files
    if (file.endsWith('.js')) {
        const importedClass = require(path.join(classRoute, file));

        // Remove js to make it the className
        const className = file.replace('.js', '');
        
        // Instantiate the saved classes in the server
        instances[className] = new importedClass();
        console.log(`Clase "${className}" registrada exitosamente\n`);
    }
});

// Create TCP server
const server = net.createServer((socket) => {
    console.log('Un cliente se ha conectado.');

    socket.on('data', (data) => {
        // Clean and receive data from client
        const petition = data.toString().trim();
        console.log(`Recibiendo del cliente los siguientes datos: ${petition} [SERVER]`)

        // Parse the string: ClassName | MethodName | data type | value
        const parts = petition.split('|');
        const className = parts[0]
        const methodName = parts[1]
        const types = parts[2].split(',');
        const strValues = parts[3].split(',');

        // Test if the parse was successful
        console.log(`Class:' ${className}`);
        console.log(`Method:' ${methodName}`);
        console.log(`Data type:' [${types.join(',')}]`);
        console.log(`Value:' [${strValues.join(',')}]`);

        // Convert values according to their types
        const parsedValues = strValues.map((val, index) => {
            if (types[index] === 'int') return parseInt(val, 10);
            if (types[index] === 'float') return parseFloat(val);
            return val; // default
            // Convert to other types if necessary
        });

        let result;

        // Verify if class and method exist in server   
        if (instances[className] && typeof instances[className][methodName] === 'function') {
            // use (...) operator to use array elements as individual values
            result = instances[className][methodName](...parsedValues);
        } else {
            result = "Error: Clase o Metodo no encontrado en el servidor.";
        }

        console.log(`Resultado: ${result}`);
        console.log(`Enviando al cliente la siguiente respuesta: ${result} [SERVER]\n `);

        // Send the response back to the client
        socket.write(result.toString());
    });

    socket.on('error', (err) => {
        console.error('Error en el socket:', err.message);
    });
});

// Initialize the server on port variable
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Servidor TCP escuchando en el puerto ${PORT}`);
});