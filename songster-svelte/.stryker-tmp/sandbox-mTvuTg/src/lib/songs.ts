// @ts-nocheck
function stryNS_9fa48() {
	var g =
		(typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis) ||
		new Function('return this')();
	var ns = g.__stryker__ || (g.__stryker__ = {});
	if (
		ns.activeMutant === undefined &&
		g.process &&
		g.process.env &&
		g.process.env.__STRYKER_ACTIVE_MUTANT__
	) {
		ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
	}
	function retrieveNS() {
		return ns;
	}
	stryNS_9fa48 = retrieveNS;
	return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
	var ns = stryNS_9fa48();
	var cov =
		ns.mutantCoverage ||
		(ns.mutantCoverage = {
			static: {},
			perTest: {},
		});
	function cover() {
		var c = cov.static;
		if (ns.currentTestId) {
			c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
		}
		var a = arguments;
		for (var i = 0; i < a.length; i++) {
			c[a[i]] = (c[a[i]] || 0) + 1;
		}
	}
	stryCov_9fa48 = cover;
	cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
	var ns = stryNS_9fa48();
	function isActive(id) {
		if (ns.activeMutant === id) {
			if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
				throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
			}
			return true;
		}
		return false;
	}
	stryMutAct_9fa48 = isActive;
	return isActive(id);
}
import type { Player, Song, Track } from './types';
export const SONG_DECK: Song[] = stryMutAct_9fa48('623')
	? []
	: (stryCov_9fa48('623'),
		[
			stryMutAct_9fa48('624')
				? {}
				: (stryCov_9fa48('624'),
					{
						id: stryMutAct_9fa48('625') ? '' : (stryCov_9fa48('625'), 's01'),
						num: 1,
						title: stryMutAct_9fa48('626') ? '' : (stryCov_9fa48('626'), 'Bohemian Rhapsody'),
						artist: stryMutAct_9fa48('627') ? '' : (stryCov_9fa48('627'), 'Queen'),
						year: 1975,
					}),
			stryMutAct_9fa48('628')
				? {}
				: (stryCov_9fa48('628'),
					{
						id: stryMutAct_9fa48('629') ? '' : (stryCov_9fa48('629'), 's02'),
						num: 2,
						title: stryMutAct_9fa48('630') ? '' : (stryCov_9fa48('630'), 'Thriller'),
						artist: stryMutAct_9fa48('631') ? '' : (stryCov_9fa48('631'), 'Michael Jackson'),
						year: 1982,
					}),
			stryMutAct_9fa48('632')
				? {}
				: (stryCov_9fa48('632'),
					{
						id: stryMutAct_9fa48('633') ? '' : (stryCov_9fa48('633'), 's03'),
						num: 3,
						title: stryMutAct_9fa48('634') ? '' : (stryCov_9fa48('634'), 'Imagine'),
						artist: stryMutAct_9fa48('635') ? '' : (stryCov_9fa48('635'), 'John Lennon'),
						year: 1971,
					}),
			stryMutAct_9fa48('636')
				? {}
				: (stryCov_9fa48('636'),
					{
						id: stryMutAct_9fa48('637') ? '' : (stryCov_9fa48('637'), 's04'),
						num: 4,
						title: stryMutAct_9fa48('638') ? '' : (stryCov_9fa48('638'), 'Like a Rolling Stone'),
						artist: stryMutAct_9fa48('639') ? '' : (stryCov_9fa48('639'), 'Bob Dylan'),
						year: 1965,
					}),
			stryMutAct_9fa48('640')
				? {}
				: (stryCov_9fa48('640'),
					{
						id: stryMutAct_9fa48('641') ? '' : (stryCov_9fa48('641'), 's05'),
						num: 5,
						title: stryMutAct_9fa48('642') ? '' : (stryCov_9fa48('642'), 'Rolling in the Deep'),
						artist: stryMutAct_9fa48('643') ? '' : (stryCov_9fa48('643'), 'Adele'),
						year: 2010,
					}),
			stryMutAct_9fa48('644')
				? {}
				: (stryCov_9fa48('644'),
					{
						id: stryMutAct_9fa48('645') ? '' : (stryCov_9fa48('645'), 's06'),
						num: 6,
						title: stryMutAct_9fa48('646') ? '' : (stryCov_9fa48('646'), 'Hey Jude'),
						artist: stryMutAct_9fa48('647') ? '' : (stryCov_9fa48('647'), 'The Beatles'),
						year: 1968,
					}),
			stryMutAct_9fa48('648')
				? {}
				: (stryCov_9fa48('648'),
					{
						id: stryMutAct_9fa48('649') ? '' : (stryCov_9fa48('649'), 's07'),
						num: 7,
						title: stryMutAct_9fa48('650') ? '' : (stryCov_9fa48('650'), 'Get Lucky'),
						artist: stryMutAct_9fa48('651') ? '' : (stryCov_9fa48('651'), 'Daft Punk'),
						year: 2013,
					}),
			stryMutAct_9fa48('652')
				? {}
				: (stryCov_9fa48('652'),
					{
						id: stryMutAct_9fa48('653') ? '' : (stryCov_9fa48('653'), 's08'),
						num: 8,
						title: stryMutAct_9fa48('654') ? '' : (stryCov_9fa48('654'), 'Billie Jean'),
						artist: stryMutAct_9fa48('655') ? '' : (stryCov_9fa48('655'), 'Michael Jackson'),
						year: 1982,
					}),
			stryMutAct_9fa48('656')
				? {}
				: (stryCov_9fa48('656'),
					{
						id: stryMutAct_9fa48('657') ? '' : (stryCov_9fa48('657'), 's09'),
						num: 9,
						title: stryMutAct_9fa48('658') ? '' : (stryCov_9fa48('658'), 'Smells Like Teen Spirit'),
						artist: stryMutAct_9fa48('659') ? '' : (stryCov_9fa48('659'), 'Nirvana'),
						year: 1991,
					}),
			stryMutAct_9fa48('660')
				? {}
				: (stryCov_9fa48('660'),
					{
						id: stryMutAct_9fa48('661') ? '' : (stryCov_9fa48('661'), 's10'),
						num: 10,
						title: stryMutAct_9fa48('662') ? '' : (stryCov_9fa48('662'), 'Yesterday'),
						artist: stryMutAct_9fa48('663') ? '' : (stryCov_9fa48('663'), 'The Beatles'),
						year: 1965,
					}),
			stryMutAct_9fa48('664')
				? {}
				: (stryCov_9fa48('664'),
					{
						id: stryMutAct_9fa48('665') ? '' : (stryCov_9fa48('665'), 's11'),
						num: 11,
						title: stryMutAct_9fa48('666') ? '' : (stryCov_9fa48('666'), 'Wonderwall'),
						artist: stryMutAct_9fa48('667') ? '' : (stryCov_9fa48('667'), 'Oasis'),
						year: 1995,
					}),
			stryMutAct_9fa48('668')
				? {}
				: (stryCov_9fa48('668'),
					{
						id: stryMutAct_9fa48('669') ? '' : (stryCov_9fa48('669'), 's12'),
						num: 12,
						title: stryMutAct_9fa48('670') ? '' : (stryCov_9fa48('670'), 'Respect'),
						artist: stryMutAct_9fa48('671') ? '' : (stryCov_9fa48('671'), 'Aretha Franklin'),
						year: 1967,
					}),
			stryMutAct_9fa48('672')
				? {}
				: (stryCov_9fa48('672'),
					{
						id: stryMutAct_9fa48('673') ? '' : (stryCov_9fa48('673'), 's13'),
						num: 13,
						title: stryMutAct_9fa48('674') ? '' : (stryCov_9fa48('674'), "Sweet Child O' Mine"),
						artist: stryMutAct_9fa48('675') ? '' : (stryCov_9fa48('675'), "Guns N' Roses"),
						year: 1988,
					}),
			stryMutAct_9fa48('676')
				? {}
				: (stryCov_9fa48('676'),
					{
						id: stryMutAct_9fa48('677') ? '' : (stryCov_9fa48('677'), 's14'),
						num: 14,
						title: stryMutAct_9fa48('678') ? '' : (stryCov_9fa48('678'), 'Purple Rain'),
						artist: stryMutAct_9fa48('679') ? '' : (stryCov_9fa48('679'), 'Prince'),
						year: 1984,
					}),
			stryMutAct_9fa48('680')
				? {}
				: (stryCov_9fa48('680'),
					{
						id: stryMutAct_9fa48('681') ? '' : (stryCov_9fa48('681'), 's15'),
						num: 15,
						title: stryMutAct_9fa48('682') ? '' : (stryCov_9fa48('682'), 'Under Pressure'),
						artist: stryMutAct_9fa48('683') ? '' : (stryCov_9fa48('683'), 'Queen & David Bowie'),
						year: 1981,
					}),
			stryMutAct_9fa48('684')
				? {}
				: (stryCov_9fa48('684'),
					{
						id: stryMutAct_9fa48('685') ? '' : (stryCov_9fa48('685'), 's16'),
						num: 16,
						title: stryMutAct_9fa48('686') ? '' : (stryCov_9fa48('686'), "Don't Stop Believin'"),
						artist: stryMutAct_9fa48('687') ? '' : (stryCov_9fa48('687'), 'Journey'),
						year: 1981,
					}),
			stryMutAct_9fa48('688')
				? {}
				: (stryCov_9fa48('688'),
					{
						id: stryMutAct_9fa48('689') ? '' : (stryCov_9fa48('689'), 's17'),
						num: 17,
						title: stryMutAct_9fa48('690') ? '' : (stryCov_9fa48('690'), 'Hotel California'),
						artist: stryMutAct_9fa48('691') ? '' : (stryCov_9fa48('691'), 'Eagles'),
						year: 1977,
					}),
			stryMutAct_9fa48('692')
				? {}
				: (stryCov_9fa48('692'),
					{
						id: stryMutAct_9fa48('693') ? '' : (stryCov_9fa48('693'), 's18'),
						num: 18,
						title: stryMutAct_9fa48('694') ? '' : (stryCov_9fa48('694'), 'Let It Be'),
						artist: stryMutAct_9fa48('695') ? '' : (stryCov_9fa48('695'), 'The Beatles'),
						year: 1970,
					}),
			stryMutAct_9fa48('696')
				? {}
				: (stryCov_9fa48('696'),
					{
						id: stryMutAct_9fa48('697') ? '' : (stryCov_9fa48('697'), 's19'),
						num: 19,
						title: stryMutAct_9fa48('698') ? '' : (stryCov_9fa48('698'), 'Stairway to Heaven'),
						artist: stryMutAct_9fa48('699') ? '' : (stryCov_9fa48('699'), 'Led Zeppelin'),
						year: 1971,
					}),
			stryMutAct_9fa48('700')
				? {}
				: (stryCov_9fa48('700'),
					{
						id: stryMutAct_9fa48('701') ? '' : (stryCov_9fa48('701'), 's20'),
						num: 20,
						title: stryMutAct_9fa48('702') ? '' : (stryCov_9fa48('702'), 'Superstition'),
						artist: stryMutAct_9fa48('703') ? '' : (stryCov_9fa48('703'), 'Stevie Wonder'),
						year: 1972,
					}),
			stryMutAct_9fa48('704')
				? {}
				: (stryCov_9fa48('704'),
					{
						id: stryMutAct_9fa48('705') ? '' : (stryCov_9fa48('705'), 's21'),
						num: 21,
						title: stryMutAct_9fa48('706') ? '' : (stryCov_9fa48('706'), "What's Going On"),
						artist: stryMutAct_9fa48('707') ? '' : (stryCov_9fa48('707'), 'Marvin Gaye'),
						year: 1971,
					}),
			stryMutAct_9fa48('708')
				? {}
				: (stryCov_9fa48('708'),
					{
						id: stryMutAct_9fa48('709') ? '' : (stryCov_9fa48('709'), 's22'),
						num: 22,
						title: stryMutAct_9fa48('710') ? '' : (stryCov_9fa48('710'), 'Dreams'),
						artist: stryMutAct_9fa48('711') ? '' : (stryCov_9fa48('711'), 'Fleetwood Mac'),
						year: 1977,
					}),
			stryMutAct_9fa48('712')
				? {}
				: (stryCov_9fa48('712'),
					{
						id: stryMutAct_9fa48('713') ? '' : (stryCov_9fa48('713'), 's23'),
						num: 23,
						title: stryMutAct_9fa48('714') ? '' : (stryCov_9fa48('714'), 'Redemption Song'),
						artist: stryMutAct_9fa48('715') ? '' : (stryCov_9fa48('715'), 'Bob Marley'),
						year: 1980,
					}),
			stryMutAct_9fa48('716')
				? {}
				: (stryCov_9fa48('716'),
					{
						id: stryMutAct_9fa48('717') ? '' : (stryCov_9fa48('717'), 's24'),
						num: 24,
						title: stryMutAct_9fa48('718') ? '' : (stryCov_9fa48('718'), 'Blinding Lights'),
						artist: stryMutAct_9fa48('719') ? '' : (stryCov_9fa48('719'), 'The Weeknd'),
						year: 2019,
					}),
			stryMutAct_9fa48('720')
				? {}
				: (stryCov_9fa48('720'),
					{
						id: stryMutAct_9fa48('721') ? '' : (stryCov_9fa48('721'), 's25'),
						num: 25,
						title: stryMutAct_9fa48('722') ? '' : (stryCov_9fa48('722'), 'Someone Like You'),
						artist: stryMutAct_9fa48('723') ? '' : (stryCov_9fa48('723'), 'Adele'),
						year: 2011,
					}),
			stryMutAct_9fa48('724')
				? {}
				: (stryCov_9fa48('724'),
					{
						id: stryMutAct_9fa48('725') ? '' : (stryCov_9fa48('725'), 's26'),
						num: 26,
						title: stryMutAct_9fa48('726') ? '' : (stryCov_9fa48('726'), 'Piano Man'),
						artist: stryMutAct_9fa48('727') ? '' : (stryCov_9fa48('727'), 'Billy Joel'),
						year: 1973,
					}),
			stryMutAct_9fa48('728')
				? {}
				: (stryCov_9fa48('728'),
					{
						id: stryMutAct_9fa48('729') ? '' : (stryCov_9fa48('729'), 's27'),
						num: 27,
						title: stryMutAct_9fa48('730') ? '' : (stryCov_9fa48('730'), 'Good Vibrations'),
						artist: stryMutAct_9fa48('731') ? '' : (stryCov_9fa48('731'), 'The Beach Boys'),
						year: 1966,
					}),
			stryMutAct_9fa48('732')
				? {}
				: (stryCov_9fa48('732'),
					{
						id: stryMutAct_9fa48('733') ? '' : (stryCov_9fa48('733'), 's28'),
						num: 28,
						title: stryMutAct_9fa48('734') ? '' : (stryCov_9fa48('734'), 'Crazy in Love'),
						artist: stryMutAct_9fa48('735') ? '' : (stryCov_9fa48('735'), 'Beyoncé'),
						year: 2003,
					}),
			stryMutAct_9fa48('736')
				? {}
				: (stryCov_9fa48('736'),
					{
						id: stryMutAct_9fa48('737') ? '' : (stryCov_9fa48('737'), 's29'),
						num: 29,
						title: stryMutAct_9fa48('738') ? '' : (stryCov_9fa48('738'), 'Losing My Religion'),
						artist: stryMutAct_9fa48('739') ? '' : (stryCov_9fa48('739'), 'R.E.M.'),
						year: 1991,
					}),
			stryMutAct_9fa48('740')
				? {}
				: (stryCov_9fa48('740'),
					{
						id: stryMutAct_9fa48('741') ? '' : (stryCov_9fa48('741'), 's30'),
						num: 30,
						title: stryMutAct_9fa48('742') ? '' : (stryCov_9fa48('742'), 'Take On Me'),
						artist: stryMutAct_9fa48('743') ? '' : (stryCov_9fa48('743'), 'a-ha'),
						year: 1985,
					}),
		]);
export function shuffled<T>(arr: T[]): T[] {
	if (stryMutAct_9fa48('744')) {
		{
		}
	} else {
		stryCov_9fa48('744');
		const a = stryMutAct_9fa48('745') ? [] : (stryCov_9fa48('745'), [...arr]);
		for (
			let i = stryMutAct_9fa48('746') ? a.length + 1 : (stryCov_9fa48('746'), a.length - 1);
			stryMutAct_9fa48('749')
				? i <= 0
				: stryMutAct_9fa48('748')
					? i >= 0
					: stryMutAct_9fa48('747')
						? false
						: (stryCov_9fa48('747', '748', '749'), i > 0);
			stryMutAct_9fa48('750') ? i++ : (stryCov_9fa48('750'), i--)
		) {
			if (stryMutAct_9fa48('751')) {
				{
				}
			} else {
				stryCov_9fa48('751');
				const j = Math.floor(
					stryMutAct_9fa48('752')
						? Math.random() / (i + 1)
						: (stryCov_9fa48('752'),
							Math.random() * (stryMutAct_9fa48('753') ? i - 1 : (stryCov_9fa48('753'), i + 1)))
				);
				[a[i], a[j]] = stryMutAct_9fa48('754') ? [] : (stryCov_9fa48('754'), [a[j], a[i]]);
			}
		}
		return a;
	}
}
export function seededPlayers(): Player[] {
	if (stryMutAct_9fa48('755')) {
		{
		}
	} else {
		stryCov_9fa48('755');
		const deck = shuffled(SONG_DECK);
		return stryMutAct_9fa48('756')
			? []
			: (stryCov_9fa48('756'),
				[
					stryMutAct_9fa48('757')
						? {}
						: (stryCov_9fa48('757'),
							{
								id: stryMutAct_9fa48('758') ? '' : (stryCov_9fa48('758'), 'p1'),
								name: stryMutAct_9fa48('759') ? '' : (stryCov_9fa48('759'), 'You'),
								avatar: stryMutAct_9fa48('760') ? '' : (stryCov_9fa48('760'), 'Y'),
								timeline: stryMutAct_9fa48('761') ? [] : (stryCov_9fa48('761'), [deck[0]]),
								tokens: 3,
							}),
					stryMutAct_9fa48('762')
						? {}
						: (stryCov_9fa48('762'),
							{
								id: stryMutAct_9fa48('763') ? '' : (stryCov_9fa48('763'), 'p2'),
								name: stryMutAct_9fa48('764') ? '' : (stryCov_9fa48('764'), 'Marlo'),
								avatar: stryMutAct_9fa48('765') ? '' : (stryCov_9fa48('765'), 'M'),
								timeline: stryMutAct_9fa48('766') ? [] : (stryCov_9fa48('766'), [deck[1]]),
								tokens: 3,
							}),
					stryMutAct_9fa48('767')
						? {}
						: (stryCov_9fa48('767'),
							{
								id: stryMutAct_9fa48('768') ? '' : (stryCov_9fa48('768'), 'p3'),
								name: stryMutAct_9fa48('769') ? '' : (stryCov_9fa48('769'), 'June'),
								avatar: stryMutAct_9fa48('770') ? '' : (stryCov_9fa48('770'), 'J'),
								timeline: stryMutAct_9fa48('771') ? [] : (stryCov_9fa48('771'), [deck[2]]),
								tokens: 3,
							}),
					stryMutAct_9fa48('772')
						? {}
						: (stryCov_9fa48('772'),
							{
								id: stryMutAct_9fa48('773') ? '' : (stryCov_9fa48('773'), 'p4'),
								name: stryMutAct_9fa48('774') ? '' : (stryCov_9fa48('774'), 'Kaz'),
								avatar: stryMutAct_9fa48('775') ? '' : (stryCov_9fa48('775'), 'K'),
								timeline: stryMutAct_9fa48('776') ? [] : (stryCov_9fa48('776'), [deck[3]]),
								tokens: 3,
							}),
				]);
	}
}
export function buildDrawPile(players: Player[]): Song[] {
	if (stryMutAct_9fa48('777')) {
		{
		}
	} else {
		stryCov_9fa48('777');
		const used = new Set(
			players.flatMap(
				stryMutAct_9fa48('778')
					? () => undefined
					: (stryCov_9fa48('778'),
						(p) =>
							p.timeline.map(
								stryMutAct_9fa48('779') ? () => undefined : (stryCov_9fa48('779'), (s) => s.id)
							))
			)
		);
		return shuffled(
			stryMutAct_9fa48('780')
				? SONG_DECK
				: (stryCov_9fa48('780'),
					SONG_DECK.filter(
						stryMutAct_9fa48('781')
							? () => undefined
							: (stryCov_9fa48('781'),
								(s) =>
									stryMutAct_9fa48('782')
										? used.has(s.id)
										: (stryCov_9fa48('782'), !used.has(s.id)))
					))
		);
	}
}
export function trackToSong(track: Track): Song {
	if (stryMutAct_9fa48('783')) {
		{
		}
	} else {
		stryCov_9fa48('783');
		return stryMutAct_9fa48('784')
			? {}
			: (stryCov_9fa48('784'),
				{
					id: track.id,
					num: track.num,
					title: track.title,
					artist: track.artist,
					year: track.year,
				});
	}
}
export function validatePlacement(timeline: Song[], card: Song, slot: number): boolean {
	if (stryMutAct_9fa48('785')) {
		{
		}
	} else {
		stryCov_9fa48('785');
		const afterPrev = stryMutAct_9fa48('788')
			? slot === 0 && timeline[slot - 1].year <= card.year
			: stryMutAct_9fa48('787')
				? false
				: stryMutAct_9fa48('786')
					? true
					: (stryCov_9fa48('786', '787', '788'),
						(stryMutAct_9fa48('790')
							? slot !== 0
							: stryMutAct_9fa48('789')
								? false
								: (stryCov_9fa48('789', '790'), slot === 0)) ||
							(stryMutAct_9fa48('793')
								? timeline[slot - 1].year > card.year
								: stryMutAct_9fa48('792')
									? timeline[slot - 1].year < card.year
									: stryMutAct_9fa48('791')
										? false
										: (stryCov_9fa48('791', '792', '793'),
											timeline[
												stryMutAct_9fa48('794') ? slot + 1 : (stryCov_9fa48('794'), slot - 1)
											].year <= card.year)));
		const beforeNext = stryMutAct_9fa48('797')
			? slot === timeline.length && card.year <= timeline[slot].year
			: stryMutAct_9fa48('796')
				? false
				: stryMutAct_9fa48('795')
					? true
					: (stryCov_9fa48('795', '796', '797'),
						(stryMutAct_9fa48('799')
							? slot !== timeline.length
							: stryMutAct_9fa48('798')
								? false
								: (stryCov_9fa48('798', '799'), slot === timeline.length)) ||
							(stryMutAct_9fa48('802')
								? card.year > timeline[slot].year
								: stryMutAct_9fa48('801')
									? card.year < timeline[slot].year
									: stryMutAct_9fa48('800')
										? false
										: (stryCov_9fa48('800', '801', '802'), card.year <= timeline[slot].year)));
		return stryMutAct_9fa48('805')
			? afterPrev || beforeNext
			: stryMutAct_9fa48('804')
				? false
				: stryMutAct_9fa48('803')
					? true
					: (stryCov_9fa48('803', '804', '805'), afterPrev && beforeNext);
	}
}
export function findCorrectSlot(timeline: Song[], card: Song): number {
	if (stryMutAct_9fa48('806')) {
		{
		}
	} else {
		stryCov_9fa48('806');
		let slot = timeline.length;
		for (
			let i = 0;
			stryMutAct_9fa48('809')
				? i > timeline.length
				: stryMutAct_9fa48('808')
					? i < timeline.length
					: stryMutAct_9fa48('807')
						? false
						: (stryCov_9fa48('807', '808', '809'), i <= timeline.length);
			stryMutAct_9fa48('810') ? i-- : (stryCov_9fa48('810'), i++)
		) {
			if (stryMutAct_9fa48('811')) {
				{
				}
			} else {
				stryCov_9fa48('811');
				const afterPrev = stryMutAct_9fa48('814')
					? i === 0 && timeline[i - 1].year <= card.year
					: stryMutAct_9fa48('813')
						? false
						: stryMutAct_9fa48('812')
							? true
							: (stryCov_9fa48('812', '813', '814'),
								(stryMutAct_9fa48('816')
									? i !== 0
									: stryMutAct_9fa48('815')
										? false
										: (stryCov_9fa48('815', '816'), i === 0)) ||
									(stryMutAct_9fa48('819')
										? timeline[i - 1].year > card.year
										: stryMutAct_9fa48('818')
											? timeline[i - 1].year < card.year
											: stryMutAct_9fa48('817')
												? false
												: (stryCov_9fa48('817', '818', '819'),
													timeline[stryMutAct_9fa48('820') ? i + 1 : (stryCov_9fa48('820'), i - 1)]
														.year <= card.year)));
				const beforeNext = stryMutAct_9fa48('823')
					? i === timeline.length && card.year <= timeline[i].year
					: stryMutAct_9fa48('822')
						? false
						: stryMutAct_9fa48('821')
							? true
							: (stryCov_9fa48('821', '822', '823'),
								(stryMutAct_9fa48('825')
									? i !== timeline.length
									: stryMutAct_9fa48('824')
										? false
										: (stryCov_9fa48('824', '825'), i === timeline.length)) ||
									(stryMutAct_9fa48('828')
										? card.year > timeline[i].year
										: stryMutAct_9fa48('827')
											? card.year < timeline[i].year
											: stryMutAct_9fa48('826')
												? false
												: (stryCov_9fa48('826', '827', '828'), card.year <= timeline[i].year)));
				if (
					stryMutAct_9fa48('831')
						? afterPrev || beforeNext
						: stryMutAct_9fa48('830')
							? false
							: stryMutAct_9fa48('829')
								? true
								: (stryCov_9fa48('829', '830', '831'), afterPrev && beforeNext)
				) {
					if (stryMutAct_9fa48('832')) {
						{
						}
					} else {
						stryCov_9fa48('832');
						slot = i;
						break;
					}
				}
			}
		}
		return slot;
	}
}
