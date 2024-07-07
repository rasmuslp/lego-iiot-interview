import type { Server, Socket } from 'socket.io';

import type { Device } from './Device';
import type { DeviceTelemetry } from './DeviceTelemetry';
import type { IDevicesGateway } from './IDevicesGateway';

export class DevicesGateway implements IDevicesGateway {
	private readonly connections = new Map<
		string,
		{ socket: Socket; device: Device }
	>();

	constructor(private readonly io: Server) {
		io.on('connection', (socket) => {
			console.log('Device connected');
			let deviceRegistered = false;

			socket.on('ID', (id: string) => {
				if (deviceRegistered) {
					return;
				}

				this.connections.set(id, {
					socket,
					device: {
						id,
					},
				});

				deviceRegistered = true;

				console.log(`Device registered: ${id}`);
			});

			socket.on('disconnect', () => {
				console.log('Device disconnected');
				for (const [id, connection] of this.connections.entries()) {
					if (connection.socket.id === socket.id) {
						this.connections.delete(id);
						console.log(`Device de-registered: ${id}`);
						return;
					}
				}
			});

			socket.on('TELEMETRY', (data: { id: string } & DeviceTelemetry) => {
				const { id, ...telemetry } = data;

				const connection = this.connections.get(id);

				if (!connection) {
					// Can happen on server restart when client reconnects
					return;
				}

				connection.device.telemetry = telemetry;

				console.log(`Stored telemetry for ${id}`, telemetry);
			});
		});
	}

	getConnectedDevices(): Device[] {
		const devices = [...this.connections.values()].map(
			(connection) => connection.device,
		);

		return devices;
	}

	upgradeDevice(id: string, targetVersion: string): void {
		const connection = this.connections.get(id);
		if (!connection) {
			throw new Error(`Device with id '${id}' not found`);
		}

		console.log(
			`Sending UPGRADE command to version ${targetVersion} for ${id}`,
		);

		connection.socket.emit('UPGRADE', targetVersion);
	}
}
