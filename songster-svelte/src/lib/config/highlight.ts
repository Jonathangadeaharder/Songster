import { PUBLIC_HIGHLIGHT_PROJECT_ID } from '$env/static/public';

export const HIGHLIGHT_PROJECT_ID = PUBLIC_HIGHLIGHT_PROJECT_ID || '1';
export const HIGHLIGHT_BACKEND_URL = 'http://localhost:8082';

export const highlightConfig = {
	projectName: 'Songster',
	environment: import.meta.env.DEV ? 'development' : 'production',
};
