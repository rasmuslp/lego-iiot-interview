import { Router } from 'express';
import type { Request } from 'express';

import type { IDevicesGateway } from './IDevicesGateway';

export function getDevicesRouter(devicesGateway: IDevicesGateway) {
	const router = Router();

	router.get('/', (request, response) => {
		const connectedDevices = devicesGateway.getConnectedDevices();
		response.json(connectedDevices);
	});

	router.post(
		'/:id/upgrade',
		(
			request: Request<{ id: string }, never, { targetVersion?: string }>,
			response,
		) => {
			const { targetVersion } = request.body;
			if (targetVersion === undefined) {
				throw new Error(
					"Required argument 'targetVersion' not provided",
				);
			}

			devicesGateway.upgradeDevice(request.params.id, targetVersion);

			response.sendStatus(200);
		},
	);

	return router;
}
