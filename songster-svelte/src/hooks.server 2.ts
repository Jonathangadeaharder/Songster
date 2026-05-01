import { createServerClient } from '@supabase/ssr';
import { type Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const handle: Handle = async ({ event, resolve }) => {
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookies: { name: string; value: string; options: Record<string, unknown> }[]) => {
				cookies.forEach(({ name, value, options }) =>
					event.cookies.set(name, value, { ...options, path: '/' })
				);
			},
		},
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { user },
		} = await event.locals.supabase.auth.getUser();
		if (!user) return { session: null };
		const {
			data: { session },
		} = await event.locals.supabase.auth.getSession();
		return { session };
	};

	return resolve(event, {
		filterSerializedResponseHeaders: (name) => name === 'content-range',
	});
};
