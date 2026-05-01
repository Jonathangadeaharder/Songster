import { createServerClient } from '@supabase/ssr';
import type { Session } from '@supabase/supabase-js';
import type { Handle } from '@sveltejs/kit';
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';

const isPlaceholder =
	PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co' &&
	PUBLIC_SUPABASE_ANON_KEY === 'placeholder-anon-key';

export const handle: Handle = async ({ event, resolve }) => {
	if (isPlaceholder) {
		// CI / E2E mode: skip real Supabase auth and provide a dummy session so
		// server-side route guards pass without redirecting to /auth/login.
		event.locals.safeGetSession = async () => ({
			session: {
				user: { id: '00000000-0000-0000-0000-000000000000' },
				access_token: 'placeholder',
				refresh_token: '',
				expires_in: 3600,
				token_type: 'bearer',
			} as unknown as Session,
		});
		return resolve(event, {
			filterSerializedResponseHeaders: (name) => name === 'content-range',
		});
	}

	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (
				cookies: {
					name: string;
					value: string;
					options: Record<string, unknown>;
				}[]
			) => {
				for (const { name, value, options } of cookies) {
					event.cookies.set(name, value, { ...options, path: '/' });
				}
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
