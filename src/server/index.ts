import { createServer } from 'node:http';

import express, { json } from 'express';
import type { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import { Server } from 'socket.io';

import { getDevelopmentRouter } from './dev/getDevelopmentRouter';
import { DevicesGateway } from './devices/DevicesGateway';
import { getDevicesRouter } from './devices/getDevicesRouter';

console.log('Server starting...');

if (process.argv.length > 3) {
	throw new Error('Too many arguments. Only expected optional port');
}

const port = process.argv[2] ?? 9000;

const app = express();
const server = createServer(app);
const io = new Server(server);
io.engine.on('connection_error', (error) => {
	console.log(`Device connection error`, error);
});

app.use(json());

app.use('/dev', getDevelopmentRouter());

const devicesGateway = new DevicesGateway(io);
app.use('/devices', getDevicesRouter(devicesGateway));

app.use(errorHandler);

server.listen(port, () => {
	console.log(`Server started and listening on port ${port}`);
});

function errorHandler(
	error: Error,
	request: Request,
	response: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	next: NextFunction,
) {
	console.error('An error occurred', {
		error: error.message,
	});

	response.status(500).json({
		error: error.message,
	});
}
