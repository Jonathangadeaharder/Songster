import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGetUser = vi.fn();
const mockGetSession = vi.fn();
let capturedCookieConfig: { getAll: () => any; setAll: (cookies: any[]) => void } | null = null;

vi.mock('@supabase/ssr', () => ({
	createServerClient: (_url: string, _key: string, config: any) => {
		capturedCookieConfig = config.cookies;
		return {
			auth: {
				getUser: mockGetUser,
				getSession: mockGetSession,
			},
		};
	},
}));

vi.mock('$env/static/public', () => ({
	PUBLIC_SUPABASE_URL: 'https://example.supabase.co',
	PUBLIC_SUPABASE_ANON_KEY: 'anon-key',
}));

import { handle } from '../../hooks.server';

function makeEvent() {
	const cookies: Record<string, string> = {};
	return {
		cookies: {
			getAll: () => Object.entries(cookies).map(([name, value]) => ({ name, value })),
			set: vi.fn((name: string, value: string, _opts?: any) => { cookies[name] = value; }),
		},
		locals: {} as Record<string, unknown>,
		resolve: vi.fn(async (evt: any) => new Response('ok')),
	} as any;
}

describe('safeGetSession via handle', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		capturedCookieConfig = null;
	});

	it('returns null session when getUser returns no user', async () => {
		mockGetUser.mockResolvedValue({ data: { user: null } });
		const event = makeEvent();
		await handle({ event, resolve: event.resolve });
		const result = await (event.locals as any).safeGetSession();
		expect(result.session).toBeNull();
	});

	it('does not call getSession when getUser returns null', async () => {
		mockGetUser.mockResolvedValue({ data: { user: null } });
		const event = makeEvent();
		await handle({ event, resolve: event.resolve });
		await (event.locals as any).safeGetSession();
		expect(mockGetSession).not.toHaveBeenCalled();
	});

	it('returns session when both getUser and getSession succeed', async () => {
		const mockSession = { access_token: 'abc', user: { id: '123' } };
		mockGetUser.mockResolvedValue({ data: { user: { id: '123' } } });
		mockGetSession.mockResolvedValue({ data: { session: mockSession } });
		const event = makeEvent();
		await handle({ event, resolve: event.resolve });
		const result = await (event.locals as any).safeGetSession();
		expect(result.session).toEqual(mockSession);
	});

	it('prioritizes getUser over getSession for security', async () => {
		mockGetUser.mockResolvedValue({ data: { user: null } });
		mockGetSession.mockResolvedValue({ data: { session: { access_token: 'fake' } } });
		const event = makeEvent();
		await handle({ event, resolve: event.resolve });
		const result = await (event.locals as any).safeGetSession();
		expect(result.session).toBeNull();
		expect(mockGetSession).not.toHaveBeenCalled();
	});

	it('attaches supabase to event.locals', async () => {
		mockGetUser.mockResolvedValue({ data: { user: null } });
		const event = makeEvent();
		await handle({ event, resolve: event.resolve });
		expect(event.locals.supabase).toBeDefined();
		expect(event.locals.supabase.auth).toBeDefined();
	});

	it('setAll callback sets cookies on the event with path "/"', async () => {
		mockGetUser.mockResolvedValue({ data: { user: null } });
		const event = makeEvent();
		await handle({ event, resolve: event.resolve });
		expect(capturedCookieConfig).not.toBeNull();
		capturedCookieConfig!.setAll([
			{ name: 'sb-token', value: 'abc123', options: { httpOnly: true } },
			{ name: 'sb-refresh', value: 'xyz789', options: {} },
		]);
		expect(event.cookies.set).toHaveBeenCalledWith('sb-token', 'abc123', { httpOnly: true, path: '/' });
		expect(event.cookies.set).toHaveBeenCalledWith('sb-refresh', 'xyz789', { path: '/' });
	});

	it('setAll callback passes getAll through to event.cookies', async () => {
		mockGetUser.mockResolvedValue({ data: { user: null } });
		const event = makeEvent();
		await handle({ event, resolve: event.resolve });
		expect(capturedCookieConfig!.getAll()).toEqual([]);
	});

	it('resolve is called with filterSerializedResponseHeaders', async () => {
		mockGetUser.mockResolvedValue({ data: { user: null } });
		const event = makeEvent();
		await handle({ event, resolve: event.resolve });
		expect(event.resolve).toHaveBeenCalledWith(event, expect.objectContaining({
			filterSerializedResponseHeaders: expect.any(Function),
		}));
		const callArgs = event.resolve.mock.calls[0];
		const filter = callArgs[1].filterSerializedResponseHeaders;
		expect(filter('content-range')).toBe(true);
		expect(filter('x-other-header')).toBe(false);
		expect(filter('set-cookie')).toBe(false);
	});
});
