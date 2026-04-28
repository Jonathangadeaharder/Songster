import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 * Route guard: results page requires a session.
 */
export const load: PageServerLoad = async ({ locals, params }) => {
	const { session } = await locals.safeGetSession();

	if (!session) {
		throw redirect(303, '/auth/login');
	}

	return { code: params.code };
};
