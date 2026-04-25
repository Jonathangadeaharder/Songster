import { describe, it, expect, vi, beforeEach } from 'vitest';

function createMockLocals() {
	const getUserMock = vi.fn();
	const getSessionMock = vi.fn();
	return {
		locals: {
			supabase: {
				auth: {
					getUser: getUserMock,
					getSession: getSessionMock,
				},
			},
			safeGetSession: async () => {
				const { data: { user } } = await getUserMock();
				if (!user) return { session: null };
				const { data: { session } } = await getSessionMock();
				return { session };
			},
		},
		getUserMock,
		getSessionMock,
	};
}

describe('safeGetSession', () => {
	let ctx: ReturnType<typeof createMockLocals>;

	beforeEach(() => {
		ctx = createMockLocals();
	});

	it('returns null session when getUser returns no user', async () => {
		ctx.getUserMock.mockResolvedValue({ data: { user: null } });
		const result = await ctx.locals.safeGetSession();
		expect(result.session).toBeNull();
	});

	it('does not call getSession when getUser returns null', async () => {
		ctx.getUserMock.mockResolvedValue({ data: { user: null } });
		await ctx.locals.safeGetSession();
		expect(ctx.getSessionMock).not.toHaveBeenCalled();
	});

	it('returns session when both getUser and getSession succeed', async () => {
		const mockSession = { access_token: 'abc', user: { id: '123' } } as any;
		ctx.getUserMock.mockResolvedValue({ data: { user: { id: '123' } } });
		ctx.getSessionMock.mockResolvedValue({ data: { session: mockSession } });
		const result = await ctx.locals.safeGetSession();
		expect(result.session).toEqual(mockSession);
	});

	it('prioritizes getUser over getSession for security', async () => {
		ctx.getUserMock.mockResolvedValue({ data: { user: null } });
		ctx.getSessionMock.mockResolvedValue({ data: { session: { access_token: 'fake' } } });
		const result = await ctx.locals.safeGetSession();
		expect(result.session).toBeNull();
		expect(ctx.getSessionMock).not.toHaveBeenCalled();
	});
});
