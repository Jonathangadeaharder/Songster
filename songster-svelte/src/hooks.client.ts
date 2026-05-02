import { H } from 'highlight.run';
import {
	HIGHLIGHT_PROJECT_ID,
	HIGHLIGHT_BACKEND_URL,
	highlightConfig,
} from '$lib/config/highlight';

H.init(HIGHLIGHT_PROJECT_ID, {
	serviceName: 'songster',
	environment: highlightConfig.environment,
	tracingOrigins: true,
	networkRecording: {
		enabled: false,
		recordHeadersAndBody: false,
	},
	backendUrl: HIGHLIGHT_BACKEND_URL,
});
