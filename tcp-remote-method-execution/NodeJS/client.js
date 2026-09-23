const net = require('net');
const readline = require('readline');

// Using readline module for menu logic
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Aux function to make async questions
const askUser= (UserQuestion) => new Promise(resolve => rl.question(UserQuestion, resolve));

// Server connection
const PORT = 3000;
const HOST = '127.0.0.1';
const client = new net.Socket();

client.connect(PORT, HOST, async () => {
    await showMainMenu();
});

// Handle server response 
client.on('data', (data) => {
    console.log(`Resultado: ${data.toString()}\n`);
});

client.on('error', (err) => {
    console.log('Error de conexion:', err.message);
    process.exit(1);
});

// Client menu
async function showMainMenu() {
    console.log("Selecciona una clase\n");
    console.log("1. Calculadora");
    console.log("2. Modificador de texto");
    console.log("3. Conversor de moneda");
    console.log("4 Salir\n");

    const option = await askUser("Opcion: ");

    if (option === '1') {
        await calculatorMenu();
    } else if (option === '2') {
        await textModifierMenu();
    } else if (option === '3') {
        await currencyConverterMenu();
    } else if (option === '4') {
        client.destroy();
        rl.close();
        process.exit(0);
    } else {
        console.log("Opcion invalida.")
        await showMainMenu();  
    }
}

// Calculator menu
async function calculatorMenu() {
    console.log("\nSeleccione una operacion\n");
    console.log("1. Sumar");
    console.log("2. Restar");
    console.log("3. Dividir");
    console.log("4 Salir\n");

    const option = await askUser("Opcion: ");

    if (option === '4') {
        return await showMainMenu();
    }

    const methods = {
        '1': 'add',
        '2': 'subtract',
        '3': 'divide'
    };

    const method = methods[option];

    if (!method) {
        console.log("Opcion invalida.");
        return await calculatorMenu();
    }

    const num1 = await askUser("Ingrese el primer numero:\n");
    const num2 = await askUser("Ingrese el segundo numero:\n");

    sendStream('Calculator', method, [num1, num2]);
}

// Text modiifer menu
async function textModifierMenu() {
    console.log("\nSeleccione una operacion\n");
    console.log("1. Convertir a mayuscula");
    console.log("2. Convertir a miniscula");
    console.log("3. Contar caracteres");
    console.log("4 Salir\n");

    const option = await askUser("Opcion: ");

    if (option === '4') {
        return await showMainMenu();
    }

    const methods = {
        '1': 'upperCase',
        '2': 'lowerCase',
        '3': 'countText'
    };

    const method = methods[option];

    if (!method) {
        console.log("Opcion invalida.");
        return await textModifierMenu();
    }

    const text = await askUser("Ingrese el texto:\n");

    //Send the data type as string
    sendStream('TextModifier', method, [text]);
}

// Currency converter menu
async function currencyConverterMenu() {
    console.log("\nSeleccione una operacion\n");
    console.log("1. Dolares a euros");
    console.log("2. Bolivar a dolar");
    console.log("3 Salir\n");

    const option = await askUser("Opcion: ");

    if (option === '3') {
        return await showMainMenu();
    }

    const methods = {
        '1': 'dollarToEuro',
        '2': 'bolivarToDollar',
    };

    const method = methods[option];

    if (!method) {
        console.log("Opcion invalida.");
        return await currencyConverterMenu();
    }

    const value = await askUser("Ingrese el valor a convertir:\n");

    //Send the data type as string
    sendStream('CurrencyConverter', method, [value]);
}

// Sends stream to server  
function sendStream(className, methodName, values) {

    // Detect data types automatically
    const types = detectDataType(values);

    const strTypes = types.join(',');
    const strValues = values.join(',');

    // Build the stream of requested data
    // Format: ClassName | MethodName | data type | value
    const stream = `${className}|${methodName}|${strTypes}|${strValues}`;

    console.log(`Enviando al servidor los siguientes datos: ${stream} [CLIENTE]`);

    // Send stream to server
    client.write(stream);

    // Slight pause before showing main menu again 
    setTimeout(async () => {
        await showMainMenu();
    }, 500)
}

// Detect Data types
function detectDataType(values) {
    return values.map(value => {
        // Clean blank fields
        const val= value.trim();

        // Avoid a empty string is considered a number
        if (val === '') return 'string';

        // Confirm if value is numeric 
        if (!isNaN(val)) {
            // If theres a dot, assumes its a float value
            if (val.includes('.')) {
                return 'float';
            }
            return 'int';
        }
        return 'string';
    });
}