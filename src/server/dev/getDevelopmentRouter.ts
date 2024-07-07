import { Router } from 'express';

export function getDevelopmentRouter() {
	const router = Router();

	router.get('/hello', (request, response) => {
		response.send('Hello World!');
	});

	router.get('/error', () => {
		throw new Error('This is an error');
	});

	router.post('/echo', (request, response) => {
		console.log(`Received body`, request.body);

		response.json({
			server: 'was here',
			received: request.body as unknown,
		});
	});

	return router;
}
