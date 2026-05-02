import { H } from 'highlight.run';
import { HIGHLIGHT_PROJECT_ID, HIGHLIGHT_BACKEND_URL } from '$lib/config/highlight';

H.init(HIGHLIGHT_PROJECT_ID, {
	serviceName: 'songster',
	backendUrl: HIGHLIGHT_BACKEND_URL,
	tracingOrigins: true,
	networkRecording: {
		enabled: true,
		recordHeadersAndBody: true,
		urlBlocklist: [
			'https://www.googleapis.com/identitytoolkit',
			'https://securetoken.googleapis.com',
		],
	},
});
