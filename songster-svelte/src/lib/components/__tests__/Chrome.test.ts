import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import Chrome from '$lib/components/Chrome.svelte';

describe('Chrome', () => {
	it('renders chrome-body container', () => {
		const { container } = render(Chrome, {
			props: {
				title: '',
				children: (() => document.createElement('span')) as any,
			},
		});
		expect(container.querySelector('.chrome-body')).toBeInTheDocument();
	});

	it('renders title when provided', () => {
		const { getByText } = render(Chrome, {
			props: {
				title: 'LOBBY · DEMO',
				children: (() => document.createElement('span')) as any,
			},
		});
		expect(getByText('LOBBY · DEMO')).toBeInTheDocument();
	});

	it('does not render chrome-bar when title is empty', () => {
		const { container } = render(Chrome, {
			props: {
				title: '',
				children: (() => document.createElement('span')) as any,
			},
		});
		expect(container.querySelector('.chrome-bar')).not.toBeInTheDocument();
	});

	it('applies dark theme colors', () => {
		const { container } = render(Chrome, {
			props: {
				theme: 'dark',
				title: 'Test',
				children: (() => document.createElement('span')) as any,
			},
		});
		const shell = container.querySelector('.shell');
		expect(shell?.getAttribute('style')).toContain('background: rgb(10, 10, 10)');
	});

	it('applies light theme colors', () => {
		const { container } = render(Chrome, {
			props: {
				theme: 'light',
				title: 'Test',
				children: (() => document.createElement('span')) as any,
			},
		});
		const shell = container.querySelector('.shell');
		expect(shell?.getAttribute('style')).toContain('background: rgb(244, 239, 228)');
	});
});
