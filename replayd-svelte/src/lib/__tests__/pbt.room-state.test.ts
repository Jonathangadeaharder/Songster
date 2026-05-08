import { describe, it, expect } from 'vitest';
import fc, { type Arbitrary } from 'fast-check';
import { roomStatus, room } from './generators';
import type { Room } from '$lib/room';

// --- State machine definition ---

type RoomStatus = Room['status'];

const VALID_TRANSITIONS: ReadonlySet<string> = new Set([
	'waiting->playing',
	'playing->finished',
	'finished->waiting',
]);

function isValidTransition(from: RoomStatus, to: RoomStatus): boolean {
	return VALID_TRANSITIONS.has(`${from}->${to}`);
}

function transition(): Arbitrary<{ from: RoomStatus; to: RoomStatus }> {
	return fc.record({ from: roomStatus(), to: roomStatus() });
}

// --- Property tests ---

describe('PBT room state machine — valid transitions only', () => {
	it('every transition in VALID_TRANSITIONS is a legal state change', () => {
		for (const key of VALID_TRANSITIONS) {
			const [from, to] = key.split('->') as RoomStatus[];
			expect(isValidTransition(from, to)).toBe(true);
		}
	});

	it('random transitions are either valid or invalid, never both', () => {
		fc.assert(
			fc.property(transition(), ({ from, to }) => {
				const result = isValidTransition(from, to);
				// Result must be boolean
				expect(typeof result).toBe('boolean');
				// If valid, it must be in the set
				if (result) {
					expect(VALID_TRANSITIONS.has(`${from}->${to}`)).toBe(true);
				}
			})
		);
	});

	it('valid transitions always move forward or reset, never stay in place', () => {
		fc.assert(
			fc.property(transition(), ({ from, to }) => {
				if (isValidTransition(from, to)) {
					expect(from).not.toBe(to);
				}
			})
		);
	});
});

describe('PBT room state machine — cannot skip states', () => {
	it('waiting->finished is invalid (must go through playing)', () => {
		expect(isValidTransition('waiting', 'finished')).toBe(false);
	});

	it('no single-step transition skips a state', () => {
		fc.assert(
			fc.property(roomStatus(), roomStatus(), (from, to) => {
				if (from === 'waiting' && to === 'finished') {
					expect(isValidTransition(from, to)).toBe(false);
				}
			})
		);
	});

	it('all three-state sequences require all intermediate states', () => {
		// The only valid 3-step cycle is waiting->playing->finished->waiting
		const cycle: RoomStatus[] = ['waiting', 'playing', 'finished'];
		for (let i = 0; i < cycle.length; i++) {
			const from = cycle[i];
			const to = cycle[(i + 1) % cycle.length];
			expect(isValidTransition(from, to)).toBe(true);
		}
	});
});

describe('PBT room state machine — cannot go backwards', () => {
	it('playing->waiting is invalid', () => {
		expect(isValidTransition('playing', 'waiting')).toBe(false);
	});

	it('finished->playing is invalid', () => {
		expect(isValidTransition('finished', 'playing')).toBe(false);
	});

	it('the only reverse-allowing transition is finished->waiting (reset)', () => {
		fc.assert(
			fc.property(transition(), ({ from, to }) => {
				if (isValidTransition(from, to)) {
					// Backwards transitions: only finished->waiting
					if (to === 'waiting') {
						expect(from).toBe('finished');
					}
					// playing can only go to finished
					if (from === 'playing') {
						expect(to).toBe('finished');
					}
				}
			})
		);
	});
});

describe('PBT room state machine — player count invariant', () => {
	it('waiting->playing requires at least 1 player (business rule)', () => {
		// The transition is valid in the state machine, but the business rule
		// requires playerCount >= 1. This is enforced by the DB, not the state machine.
		expect(isValidTransition('waiting', 'playing')).toBe(true);
	});

	it('started rooms have a started_at timestamp', () => {
		fc.assert(
			fc.property(room(), (r) => {
				if (r.status === 'playing' || r.status === 'finished') {
					expect(r.started_at).not.toBeNull();
				}
			})
		);
	});
});

describe('PBT room state machine — exhaustive coverage', () => {
	it('exactly 3 valid transitions exist', () => {
		expect(VALID_TRANSITIONS.size).toBe(3);
	});

	it('all 9 possible transitions are classified as valid or invalid', () => {
		const statuses: RoomStatus[] = ['waiting', 'playing', 'finished'];
		let validCount = 0;
		let invalidCount = 0;
		for (const from of statuses) {
			for (const to of statuses) {
				if (isValidTransition(from, to)) {
					validCount++;
				} else {
					invalidCount++;
				}
			}
		}
		expect(validCount).toBe(3);
		expect(invalidCount).toBe(6);
	});

	it('every generated room has a valid status', () => {
		fc.assert(
			fc.property(room(), (r) => {
				expect(['waiting', 'playing', 'finished']).toContain(r.status);
			})
		);
	});
});
