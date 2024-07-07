import { io } from 'socket.io-client';

console.log('Device starting...');

if (process.argv.length < 4) {
	throw new Error('Too few arguments. Expects host:port and id.');
}

const host = process.argv[2];
const id = process.argv[3];
let osVersion = '0.1.0';

console.log(`Will connect to '${host}' as '${id}'`);

const socket = io(host);

socket.on('connect', () => {
	console.log('Device connected, transmitting id.');
	socket.emit('ID', id);
});

socket.on('connect_error', (error) => {
	console.log('Connection error', error.message);
});

socket.on('disconnect', (reason) => {
	console.log('Device disconnect:', reason);
});

function generateTelemetry() {
	return {
		id,
		osVersion,
		cpuTemp: getNumberInRange(40, 50),
	};
}

function getNumberInRange(min: number, max: number) {
	const diff = max - min;
	return min + Math.floor(Math.random() * diff);
}

function sendTelemetry() {
	socket.emit('TELEMETRY', generateTelemetry());
}

setInterval(sendTelemetry, 1000);

socket.on('UPGRADE', (targetVersion: string) => {
	console.log(`Device received UPGRADE command to ${targetVersion}`);
	osVersion = targetVersion;
});
