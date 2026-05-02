// @ts-nocheck
import { describe, expect, it } from 'vitest';
import { colors } from '$lib/utils';

describe('colors', () => {
	it('returns dark palette for dark theme', () => {
		const c = colors('dark');
		expect(c.primary).toBe('#f4efe4');
		expect(c.paper).toBe('#0a0a0a');
		expect(c.muted).toContain('rgba(244,239,228');
	});

	it('returns light palette for light theme', () => {
		const c = colors('light');
		expect(c.primary).toBe('#0a0a0a');
		expect(c.paper).toBe('#f4efe4');
		expect(c.muted).toContain('rgba(10,10,10');
	});

	it('always returns primary, paper, and muted', () => {
		const c = colors('light');
		expect(c).toHaveProperty('primary');
		expect(c).toHaveProperty('paper');
		expect(c).toHaveProperty('muted');
	});
});
