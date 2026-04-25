let params: Record<string, string> = {};
let url = new URL('http://localhost:5173');
let routeId = '';

export function __setPageState(p: Record<string, string>, u?: URL, r?: string) {
	params = p;
	if (u) url = u;
	if (r !== undefined) routeId = r;
}

export const page = {
	get params() { return params; },
	get url() { return url; },
	get route() { return { id: routeId }; },
	status: 200,
	error: null,
	data: {},
	form: null,
	state: {},
	navigate: () => {},
};
