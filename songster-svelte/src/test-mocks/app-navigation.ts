export function goto(_url: string, _opts?: Record<string, unknown>) {}
export function invalidate(_url?: string) {}
export function invalidateAll() {}
export function preloadData(_url: string) { return Promise.resolve({ type: 'loaded' as const, status: 200, data: {} }); }
export function preloadCode(_url: string) { return Promise.resolve(); }
export function pushState(_url: string, _state: Record<string, unknown>) {}
export function replaceState(_url: string, _state: Record<string, unknown>) {}
export function beforeNavigate(_cb: unknown) {}
export function afterNavigate(_cb: unknown) {}
