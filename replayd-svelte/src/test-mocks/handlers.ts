import { HttpResponse, http } from 'msw';
import searchFixture from '../test-fixtures/deezer-search-response.json';
import trackFixture from '../test-fixtures/deezer-track-response.json';

export const handlers = [
	http.get('/api/track/search', () => {
		return HttpResponse.json(
			searchFixture.data.map((d: any) => ({
				id: `dz-${d.id}`,
				num: d.id,
				title: d.title,
				artist: d.artist.name,
				year: 1975,
				deezer_id: d.id,
				preview_url: d.preview,
				cover_small: d.album.cover_small,
				cover_medium: d.album.cover_medium,
				duration: d.duration,
			}))
		);
	}),

	http.get('/api/track/:id', ({ params }) => {
		return HttpResponse.json({
			id: `dz-${params.id}`,
			num: Number(params.id),
			title: trackFixture.title,
			artist: trackFixture.artist.name,
			year: 1975,
			deezer_id: Number(params.id),
			preview_url: trackFixture.preview,
			cover_small: trackFixture.album.cover_small,
			cover_medium: trackFixture.album.cover_medium,
			duration: trackFixture.duration,
		});
	}),
];
