import express, { json } from 'express';
import type { NextFunction, Request, Response } from 'express';
import 'express-async-errors';

import { getDevelopmentRouter } from './dev/getDevelopmentRouter';

console.log('Server starting...');

if (process.argv.length > 3) {
	throw new Error('Too many arguments. Only expected optional port');
}

const port = process.argv[2] ?? 9000;

const app = express();
app.use(json());

app.use('/dev', getDevelopmentRouter());

app.use(errorHandler);

app.listen(port, () => {
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
