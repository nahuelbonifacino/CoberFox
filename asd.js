const fs = require('fs');
const readlineSync = require('readline-sync');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');

const CSV_FILE = 'pesadas.csv';
const CONFIG_FILE = 'config.csv';

let stopReading = false;
let lastWeight = '0';

function showMenu() {
    console.log("1. Registrar nueva pesada");
    console.log("2. Ver datos registrados");
    console.log("3. Salir");
    console.log("4. Configuración");
    console.log("5. Segunda pesada");
    const choice = readlineSync.question("Seleccione una opción: ");
    return choice;
}

function readWeight(port) {
    const parser = port.pipe(new Readline({ delimiter: '\r\n' }));
    parser.on('data', data => {
        if (!stopReading) {
            lastWeight = data.trim();
            process.stdout.write(`\rPeso actual: ${lastWeight} kg`);
        }
    });
}

function addPesada() {
    const config = loadConfiguration();
    const portName = config.port || 'COM1';
    const baudRate = config.baudrate || 9600;

    const port = new SerialPort(portName, { baudRate, autoOpen: false });
    port.open(err => {
        if (err) {
            console.error(`Error al abrir el puerto serie: ${err.message}`);
            return;
        }
        console.log(`Conectado a ${portName} a ${baudRate} baudios.`);

        const chofer = readlineSync.question("Ingrese el nombre del chofer: ");
        const matricula = readlineSync.question("Ingrese la matrícula del vehículo: ");
        const observaciones = readlineSync.question("Ingrese observaciones: ");

        console.log("Leyendo el peso del puerto serie, presione Enter para finalizar...");
        stopReading = false;
        readWeight(port);
        readlineSync.question();  // Espera hasta que el usuario presione Enter
        stopReading = true;

        port.close();
        saveToCSV([String(loadPesadas().length + 1), chofer, matricula, observaciones, lastWeight, '', '0.0']);
        console.log(`\nPesada registrada correctamente con peso ${lastWeight} kg.\n`);
    });
}

function saveToCSV(data) {
    const rows = loadPesadas();
    rows.push(data);
    fs.writeFileSync(CSV_FILE, rows.map(r => r.join(',')).join('\n'));
}

function viewPesadas() {
    const pesadas = loadPesadas();
    if (pesadas.length === 0) {
        console.log("No hay pesadas registradas.\n");
    } else {
        console.log(`Número de pesadas: ${pesadas.length}`);
        pesadas.forEach(p => {
            console.log(`Pesada ${p[0]}: Chofer=${p[1]}, Matrícula=${p[2]}, Observaciones=${p[3]}, Peso=${p[4]} kg, Peso2=${p[5]} kg, Peso Neto=${p[6]} kg`);
        });
        console.log();
    }
}

function segundaPesada() {
    const pesadas = loadPesadas();
    const openPesadas = pesadas.filter(p => p[5] === '' && p[6] === '0.0');

    if (openPesadas.length === 0) {
        console.log("No hay pesadas disponibles para registrar un segundo peso.\n");
        return;
    }

    console.log("Pesadas disponibles para añadir un segundo peso:");
    openPesadas.forEach(p => {
        console.log(`Pesada ${p[0]}: Chofer=${p[1]}, Matrícula=${p[2]}, Observaciones=${p[3]}, Peso=${p[4]} kg`);
    });

    const selectedId = readlineSync.question("Ingrese el ID de la pesada para registrar el segundo peso: ");
    const selectedPesada = openPesadas.find(p => p[0] === selectedId);
    if (!selectedPesada) {
        console.log("ID no válido, por favor intente de nuevo.\n");
        return;
    }

    const config = loadConfiguration();
    const portName = config.port || 'COM1';
    const baudRate = config.baudrate || 9600;

    const port = new SerialPort(portName, { baudRate, autoOpen: false });
    port.open(err => {
        if (err) {
            console.error(`Error al abrir el puerto serie: ${err.message}`);
            return;
        }
        console.log(`Conectado a ${portName} a ${baudRate} baudios.`);

        console.log(`Leyendo el segundo peso para la pesada ${selectedId}, presione Enter para finalizar...`);
        stopReading = false;
        readWeight(port);
        readlineSync.question();  // Espera hasta que el usuario presione Enter
        stopReading = true;

        port.close();
        try {
            const peso1 = parseFloat(selectedPesada[4]);
            const peso2 = parseFloat(lastWeight);
            const pesoNeto = Math.abs(peso1 - peso2);

            selectedPesada[5] = lastWeight;
            selectedPesada[6] = String(pesoNeto);
            updatePesadaInCSV(selectedPesada);

            console.log(`Segundo peso registrado correctamente con peso ${lastWeight} kg, Peso Neto: ${pesoNeto} kg.\n`);
        } catch (error) {
            console.error("Error: Problema al convertir los pesos a números.\n");
        }
    });
}

function updatePesadaInCSV(updatedPesada) {
    const pesadas = loadPesadas();
    const index = pesadas.findIndex(p => p[0] === updatedPesada[0]);
    if (index !== -1) {
        pesadas[index] = updatedPesada;
    }
    fs.writeFileSync(CSV_FILE, pesadas.map(r => r.join(',')).join('\n'));
}

function setConfiguration() {
    const port = readlineSync.question("Ingrese el nombre del puerto COM (ejemplo: COM3): ");
    const baudrate = readlineSync.question("Ingrese la velocidad en baudios (ejemplo: 9600): ");

    const configData = [['port', 'baudrate'], [port, baudrate]];
    fs.writeFileSync(CONFIG_FILE, configData.map(r => r.join(',')).join('\n'));
    console.log(`Configuración guardada: Puerto ${port}, Baudios ${baudrate}.\n`);
}

function loadConfiguration() {
    try {
        const data = fs.readFileSync(CONFIG_FILE, 'utf8').split('\n').map(line => line.split(','));
        return { port: data[1][0], baudrate: parseInt(data[1][1], 10) };
    } catch (error) {
        return { port: 'COM1', baudrate: 9600 };
    }
}

function loadPesadas() {
    try {
        return fs.readFileSync(CSV_FILE, 'utf8').split('\n').slice(1).map(line => line.split(','));
    } catch (error) {
        return [];
    }
}

function main() {
    while (true) {
        const choice = showMenu();
        switch (choice) {
            case '1':
                addPesada();
                break;
            case '2':
                viewPesadas();
                break;
            case '3':
                console.log("Saliendo del programa.");
                return;
            case '4':
                setConfiguration();
                break;
            case '5':
                segundaPesada();
                break;
            default:
                console.log("Opción no válida, por favor intente de nuevo.\n");
        }
    }
}

main();
