import type { Device } from './Device';

export interface IDevicesGateway {
	getConnectedDevices(): Device[];
	upgradeDevice(id: string, targetVersion: string): void;
}
