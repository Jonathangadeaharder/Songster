import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET as trackGET } from '../../../routes/api/track/[id]/+server';
import { GET as searchGET } from '../../../routes/api/track/search/+server';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('/api/track/search', () => {
	beforeEach(() => vi.restoreAllMocks());

	it('returns Track[] for valid query', async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					data: [
						{
							id: 1,
							title: 'Song',
							artist: { name: 'Artist' },
							album: { title: 'Album' },
							preview: 'url',
							duration: 30,
						},
					],
				}),
		});

		const request = new Request('http://localhost/api/track/search?q=hello&limit=5');
		const response = await searchGET({
			request,
			url: new URL(request.url),
		} as any);
		const json = await response.json();

		expect(response.status).toBe(200);
		expect(json).toHaveLength(1);
		expect(json[0].title).toBe('Song');
	});

	it('returns 400 when q param is missing', async () => {
		const request = new Request('http://localhost/api/track/search?limit=5');
		await expect(searchGET({ request, url: new URL(request.url) } as any)).rejects.toMatchObject({
			status: 400,
		});
	});

	it('returns empty array for no results', async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: () => Promise.resolve({ data: [] }),
		});
		const request = new Request('http://localhost/api/track/search?q=xyz');
		const response = await searchGET({
			request,
			url: new URL(request.url),
		} as any);
		const json = await response.json();
		expect(json).toEqual([]);
	});

	it('returns 503 on Deezer rate limit', async () => {
		mockFetch.mockResolvedValue({
			ok: false,
			status: 429,
			headers: new Headers({ 'Retry-After': '10' }),
		});
		const request = new Request('http://localhost/api/track/search?q=test');
		const response = await searchGET({
			request,
			url: new URL(request.url),
		} as any);
		expect(response.status).toBe(503);
		expect(response.headers.get('Retry-After')).toBe('10');
	});

	it('returns 502 on network error', async () => {
		mockFetch.mockRejectedValue(new Error('network'));
		const request = new Request('http://localhost/api/track/search?q=test');
		await expect(searchGET({ request, url: new URL(request.url) } as any)).rejects.toMatchObject({
			status: 502,
		});
	});
});

describe('/api/track/[id]', () => {
	beforeEach(() => vi.restoreAllMocks());

	it('returns Track for valid id', async () => {
		mockFetch.mockResolvedValue({
			ok: true,
			json: () =>
				Promise.resolve({
					id: 1,
					title: 'Song',
					artist: { name: 'Artist' },
					album: { title: 'Album' },
					preview: 'url',
					duration: 30,
				}),
		});

		const request = new Request('http://localhost/api/track/1');
		const response = await trackGET({
			request,
			params: { id: '1' },
			url: new URL(request.url),
		} as any);
		const json = await response.json();

		expect(response.status).toBe(200);
		expect(json.deezer_id).toBe(1);
	});

	it('returns 404 for nonexistent track', async () => {
		mockFetch.mockResolvedValue({ ok: false, status: 404 });
		const request = new Request('http://localhost/api/track/999');
		await expect(
			trackGET({
				request,
				params: { id: '999' },
				url: new URL(request.url),
			} as any)
		).rejects.toMatchObject({ status: 404 });
	});

	it('returns 503 with Retry-After on Deezer rate limit', async () => {
		mockFetch.mockResolvedValue({
			ok: false,
			status: 429,
			headers: new Headers({ 'Retry-After': '15' }),
		});
		const request = new Request('http://localhost/api/track/1');
		const response = await trackGET({
			request,
			params: { id: '1' },
			url: new URL(request.url),
		} as any);
		expect(response.status).toBe(503);
		expect(response.headers.get('Retry-After')).toBe('15');
	});
});
