import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const startTime = Date.now();

export const GET: RequestHandler = async () => {
	return json({
		status: 'ok',
		version: process.env.npm_package_version ?? 'unknown',
		uptime: Math.floor((Date.now() - startTime) / 1000),
	});
};
