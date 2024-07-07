import type { DeviceTelemetry } from './DeviceTelemetry';

export interface Device {
	id: string;
	telemetry?: DeviceTelemetry;
}
