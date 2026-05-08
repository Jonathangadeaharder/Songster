import { render } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Waveform from '$lib/components/Waveform.svelte';

const mockGetByteFrequencyData = vi.fn();
class MockAnalyserNode {
	fftSize = 64;
	frequencyBinCount = 32;
	getByteFrequencyData = mockGetByteFrequencyData;
	connect = vi.fn();
}
class MockAudioContext {
	createAnalyser = vi.fn().mockReturnValue(new MockAnalyserNode());
	createMediaElementSource = vi.fn().mockReturnValue({ connect: vi.fn() });
	resume = vi.fn().mockResolvedValue(undefined);
}
vi.stubGlobal('AudioContext', MockAudioContext);
vi.stubGlobal(
	'matchMedia',
	vi.fn().mockReturnValue({
		matches: false,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	})
);

describe('Waveform', () => {
	it('renders canvas element', () => {
		const { container } = render(Waveform, { props: { playing: true } });
		expect(container.querySelector('canvas')).toBeInTheDocument();
	});
});
