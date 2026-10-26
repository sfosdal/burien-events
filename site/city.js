// The city — every fact that makes this calendar Burien's rather than
// another town's, in one place (2026-10-16: a sister of lqa-events, built
// the way Port Angeles and Pioneer Square were). The browser (filter.js,
// app.js) and the build (scripts/*.mjs) both read it; nothing else names a
// venue or a team. The shared files (app.js, filter.js, styles.css bar its
// --v-* hues, scripts/*.mjs bar fetch-events.mjs and sources.mjs) are
// lqa-events' own, byte for byte — see README "Sister sites".
//
// Burien: pop. 52,000 on Puget Sound south of Seattle, the Highline area's
// town — Olde Burien and the Town Square downtown, Seahurst Park and Three
// Tree Point on the water, Sea-Tac over the hill. Its rooms are the
// Highline Performing Arts Center (the hall on the Highline High School
// campus), the Town Square plaza, the community center, the heritage
// museum, a couple of bars with a stage, and the schools' stages and
// fields; nothing here sells through Ticketmaster, so the list is read
// from the rooms' own pages and the town's two calendars (B-Town Blog and
// Discover Burien), with Des Moines, Starfire in Tukwila and White Center's
// park beyond the city line.
//
// Loaded before filter.js (a plain script, so the tests can share it): it
// sets globalThis.LQACity (the name is the shared code's, not the city's).
(function (global) {
  'use strict';

  // The home teams, matched on the event title whatever the venue. Order =
  // the Teams strip, left to right. Burien has no club of its own on any
  // league feed, so the strip is Seattle's — the six clubs the south end
  // drives in for, Teams-view-only (their home grounds are not venues here
  // and there is no `inject`, so their games never enter the listing), and
  // the Seawolves, whose Starfire Stadium is ten minutes up the road and IS a
  // room here (their home matches are written into the listing). Per team:
  //   re        the title match
  //   venue     the home building; schedule = the club's own schedule page
  //   sport     keys the strip icon (app.js SPORT_ICONS), the game clock,
  //             the leader categories
  //   colors    [primary, accent] — the season calendar's home cells and
  //             card frames
  //   espn      ESPN's sport/league/team id — the season, the form block,
  //             news and transactions (schedules.mjs); the Mariners' season
  //             comes from MLB's stats API, the Kraken's from the NHL's, the
  //             Seawolves' from the club's own site
  //   division  (baseball) the division rivals by the abbreviations the
  //             schedule carries, for the standings line
  //   club      the club's name on Ticketmaster; news the outlets' feeds;
  //             wiki the article; opens when the season usually starts
  // The entries are lqa-events' and seattle-events' verbatim — keep them in
  // step (records, feeds, YouTube channels).
  var ST = function (s) { return ['https://www.seattletimes.com/sports/' + s + '/feed/', 'Seattle Times']; }; // the Seattle clubs' beat
  var TEAMS = [
    { slug: 'seahawks', label: 'Seahawks', re: /seahawks/i, sport: 'football', venue: 'Lumen Field', colors: ['#002244', '#69be28'],
      espn: { sport: 'football', league: 'nfl', id: '26' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/nfl/500/sea.png', schedule: 'https://www.seahawks.com/schedule/',
      club: 'Seattle Seahawks', opens: 'September', wiki: { title: 'Seattle Seahawks', startYear: true },
      news: [ST('seahawks'), ['https://www.seahawks.com/rss/news', 'Seahawks.com'], ['https://www.fieldgulls.com/rss/current.xml', 'Field Gulls']],
      youtube: ['UCzkFCRiMcOBeef8xcaqipmw', 'UCDVYQ4Zhbm3S2dlz7P1GBDg'] }, // @Seahawks, @NFL
    { slug: 'mariners', label: 'Mariners', re: /mariners/i, sport: 'baseball', venue: 'T-Mobile Park', colors: ['#0c2c56', '#005c5c'],
      espn: { sport: 'baseball', league: 'mlb', id: '12' }, season: { kind: 'mlb', id: 136 }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/mlb/500/sea.png', schedule: 'https://www.mlb.com/mariners/schedule',
      club: 'Seattle Mariners', opens: 'late March', wiki: { title: 'Seattle Mariners' },
      division: ['HOU', 'LAA', 'ATH', 'TEX'], // AL West, by the abbreviations the schedule carries (ATH since the Athletics left Oakland)
      news: [ST('mariners'), ['https://www.mlb.com/mariners/feeds/news/rss.xml', 'MLB.com'], ['https://www.lookoutlanding.com/rss/current.xml', 'Lookout Landing']],
      youtube: ['UCWWLs-O8JGYYcNea7AgumAA'] }, // @mariners (MLB's clips come from statsapi)
    { slug: 'kraken', label: 'Kraken', re: /kraken/i, sport: 'hockey', venue: 'Climate Pledge Arena', colors: ['#001628', '#99d9d9'],
      espn: { sport: 'hockey', league: 'nhl', id: '124292' }, season: { kind: 'nhl', abbrev: 'SEA' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/nhl/500/sea.png', schedule: 'https://www.nhl.com/kraken/schedule',
      club: 'Seattle Kraken', opens: 'early October', wiki: { title: 'Seattle Kraken' },
      news: [ST('kraken'), ['https://soundofhockey.com/feed/', 'Sound Of Hockey'], ['https://www.davyjoneslockerroom.com/rss/current.xml', "Davy Jones' Locker Room"]],
      youtube: ['UCxspiBq2xf5pLjz9_NMjoyw'] }, // @seattlekraken (the NHL's clips come from api-web)
    { slug: 'storm', label: 'Storm', re: /seattle storm/i, sport: 'basketball', venue: 'Climate Pledge Arena', colors: ['#2c5234', '#fee11a'],
      espn: { sport: 'basketball', league: 'wnba', id: '14' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/wnba/500/sea.png', schedule: 'https://storm.wnba.com/schedule/',
      club: 'Seattle Storm', opens: 'May', wiki: { title: 'Seattle Storm' },
      news: [ST('storm')],
      youtube: ['UCv4xLXLA_aElluuaTWXN1jA', 'UCO9a_ryN_l7DIDS-VIt-zmw'] }, // @SeattleStormOfficial, @WNBA
    { slug: 'reign', label: 'Reign', re: /reign fc|seattle reign/i, sport: 'soccer', venue: 'Lumen Field', colors: ['#0a2240', '#c5a05a'],
      espn: { sport: 'soccer', league: 'usa.nwsl', id: '15363' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/15363.png', schedule: 'https://www.reignfc.com/schedule',
      club: 'Seattle Reign', opens: 'March', wiki: { title: 'Seattle Reign FC' },
      news: [ST('reign')],
      youtube: ['UCokzki4ovbASTy0MGok5DpQ', 'UCL4xu08EDu0ZFZsBJUB0chw'] }, // @reignfc, @nwslsoccer
    // the Seawolves (Major League Rugby) play at Starfire Stadium in Tukwila, ten minutes from Burien — the one club
    // whose ground is a room here, so its home matches enter the listing (inject); the entry is seattle-events' verbatim
    { slug: 'seawolves', label: 'Seawolves', re: /seawolves/i, sport: 'rugby', venue: 'Starfire Stadium', colors: ['#003057', '#6cbe45'],
      season: { kind: 'seawolves' }, form: { kind: 'seawolves' },
      inject: { name: 'Seattle Seawolves', url: 'https://tickets.seawolves.rugby/events' }, // no ticket feed for Starfire: the home matches enter the listing from the schedule, linked to the club's ticket page
      logo: 'https://www.seawolves.rugby/images/seawolves-logo.png', schedule: 'https://www.seawolves.rugby/schedule',
      club: 'Seattle Seawolves', opens: 'March', wiki: { title: 'Seattle Seawolves' },
      youtube: ['UCPcMc2KfvSO0YGfxzrbzy3w', 'UCIynwDVqRK7KTUy72_kSBhA'] }, // @seattleseawolvesrugby, @USMLR
    { slug: 'sounders', label: 'Sounders', re: /sounders/i, sport: 'soccer', venue: 'Lumen Field', colors: ['#236192', '#5d9741'],
      espn: { sport: 'soccer', league: 'usa.1', id: '9726' }, season: { kind: 'espn' }, form: { kind: 'espn' },
      logo: 'https://a.espncdn.com/i/teamlogos/soccer/500/9726.png', schedule: 'https://www.soundersfc.com/schedule/',
      club: 'Seattle Sounders', opens: 'late February', wiki: { title: 'Seattle Sounders FC' },
      news: [ST('sounders'), ['https://www.sounderatheart.com/feed', 'Sounder at Heart']],
      youtube: ['UCVhbRUhe_hfmgi-UN1gcQzw', 'UCSZbXT5TLLW_i-5W8FZpFsg'] }, // @SoundersFC, @MLS
  ];

  // The venues. Keys are the display names the feeds are folded to. Per venue:
  //   area     'town' = beyond the city line — Des Moines, Tukwila, White
  //            Center (the panel's second group); unmarked = Burien itself
  //   capacity the Capacity rows' thresholds (the share-code 'cap' bits)
  //   type     the default event type when the feed names none
  //   cssVar   the hue in styles.css (light and dark values live there);
  //            color is the light one for the places that read it directly
  //   url      the room's own events page (the sheet's venue link)
  //   icon     the favicon, through Google's cache
  //   tm       the Ticketmaster venue id(s) and the name test (every page is
  //            read; `match` is a lower-case substring of the venue's TM
  //            name); fallbackUrl when a listing has no link of its own
  //   feed     the room's own calendar, read by scripts/feeds.mjs (`kind`)
  //   alias    the other spellings the feeds use for it, folded to this name
  // Ticketmaster has nothing in Burien (2026-10-16: the Highline PAC and
  // Starfire have venue records and no listings); the rooms are read from
  // their own pages and from the two town calendars (FEEDS below), whose rows
  // fold onto these rooms by alias or, for everywhere else, into Around Burien.
  var VENUES = {
    'Highline Performing Arts Center': { // the hall on the Highline High School campus: touring shows, the Northwest Symphony, the schools' concerts
      geo: [47.46652, -122.32877],
      capacity: 1000,
      type: 'arts',
      cssVar: '--v-hpac',
      color: '#b486ea',
      url: 'https://www.highlinepac.org/events',
      icon: 'https://www.google.com/s2/favicons?domain=www.highlinepac.org&sz=128',
      // its own events page (Wix, hand-laid) is read by fetch-events.mjs (parseHighlinePac); Ticketmaster's record is empty but watched
      tm: { id: 'KovZpZAaIA6A', match: 'highline', fallbackUrl: 'https://www.highlinepac.org/events' },
      alias: /highline (performing arts|pac)|highline high school/i,
    },
    'Burien Town Square': { // the downtown plaza: the Thursday farmers market, the holiday and summer events
      geo: [47.46706, -122.34021],
      capacity: 1500,
      type: 'community',
      cssVar: '--v-townsq',
      color: '#86eab4',
      url: 'https://www.discoverburien.org/calendar',
      icon: 'https://www.google.com/s2/favicons?domain=www.discoverburien.org&sz=128',
      alias: /town square/i,
    },
    'Burien Community Center': { // the city's rec building beside Moshier Park (Día de los Muertos, the city's own programs)
      geo: [47.47097, -122.34142],
      capacity: 300,
      type: 'community',
      cssVar: '--v-bcc',
      color: '#86d9ea',
      url: 'https://www.burienwa.gov/',
      icon: 'https://www.google.com/s2/favicons?domain=www.burienwa.gov&sz=128',
      alias: /burien community center/i,
    },
    'Highline Heritage Museum': { // the area's history museum on SW 152nd (talks, 7 Stories, exhibitions) — no site of its own that resolves; B-Town's venue page stands in
      geo: [47.46648, -122.34543],
      capacity: 100,
      type: 'arts',
      cssVar: '--v-museum',
      color: '#eabc86',
      url: 'https://b-townblog.com/venue/highline-heritage-museum/',
      icon: 'https://www.google.com/s2/favicons?domain=b-townblog.com&sz=128',
      alias: /highline heritage/i,
    },
    'The Tin Room': { // Olde Burien's bar and grill with a stage (its SpotHopper site prints no calendar; the town calendars carry its nights)
      geo: [47.46667, -122.34687],
      capacity: 150,
      type: 'concert',
      cssVar: '--v-tinroom',
      color: '#ea8686',
      url: 'https://tinroombar.com/events',
      icon: 'https://www.google.com/s2/favicons?domain=tinroombar.com&sz=128',
      alias: /tin room/i,
    },
    'Kennedy Catholic High School': { // BAT Theatre's stage since 2025 (its own site is walled), the school's concerts
      geo: [47.47843, -122.33086],
      capacity: 600,
      type: 'arts',
      cssVar: '--v-kennedy',
      color: '#86a3ea',
      url: 'https://www.kennedyhs.org/',
      icon: 'https://www.google.com/s2/favicons?domain=www.kennedyhs.org&sz=128',
      alias: /kennedy catholic/i,
    },
    'Highline Memorial Stadium': { // the district's stadium beside the PAC: Highline and Kennedy football and soccer
      geo: [47.4652, -122.3322],
      capacity: 4000,
      type: 'sports',
      cssVar: '--v-memorial',
      color: '#c0ea86',
      url: 'https://www.highlineschools.org/',
      icon: 'https://www.google.com/s2/favicons?domain=www.highlineschools.org&sz=128',
      alias: /highline memorial stadium/i,
    },
    'Around Burien': { // everywhere else the town calendars list — Downtown Burien, the parks, the Elks, the bottle shops, the pop-ups (groundsVenue)
      geo: [47.46706, -122.33967],
      capacity: 500,
      type: 'community',
      cssVar: '--v-around',
      color: '#8ee0e0',
      url: 'https://b-townblog.com/events/',
      icon: 'https://www.google.com/s2/favicons?domain=b-townblog.com&sz=128',
    },
    'Des Moines': { // the next town down the shore: the city's parks calendar — Beach Park, the Marina, the Field House
      geo: [47.40749, -122.31918],
      area: 'town',
      capacity: 2000,
      type: 'community',
      cssVar: '--v-desmoines',
      color: '#ea86b4',
      url: 'https://www.desmoineswa.gov/Calendar.aspx',
      icon: 'https://www.google.com/s2/favicons?domain=www.desmoineswa.gov&sz=128',
      // the CivicPlus calendar's RSS, read as cards: title then link, EventDates + EventTimes (an all-day row prints 12:00 AM - 11:59 PM, left as no clock), the civic meetings dropped
      feed: { kind: 'cards', url: 'https://www.desmoineswa.gov/RSSFeed.aspx?ModID=58&CID=All-calendar.xml',
        item: /<item>/, title: /(?=[\s\S]*?<link>([^<]+)<\/link>)<title>([^<]+)<\/title>/,
        when: /<calendarEvent:EventDates>\s*([^<]+?)\s*<\/calendarEvent:EventDates>\s*<calendarEvent:EventTimes>(?:12:00 AM - 11:59 PM|([^<]*))</,
        drop: /council|commission|board|committee|meeting|recycling|hearing|workshop/i },
      alias: /des moines/i,
    },
    'Starfire Stadium': { // Tukwila, ten minutes north: the Seawolves' ground (Major League Rugby, March to June); both Ticketmaster records are watched
      geo: [47.47009, -122.24938],
      area: 'town',
      capacity: 4500,
      type: 'sports',
      cssVar: '--v-starfire',
      color: '#86ead9',
      url: 'https://www.starfiresports.com/',
      icon: 'https://www.google.com/s2/favicons?domain=www.starfiresports.com&sz=128',
      tm: { id: 'KovZpapC8e,Za5ju3rKuqZyTRkCZhqk-tJouqkmkhqe', match: 'starfire', fallbackUrl: 'https://www.starfiresports.com/' },
      alias: /starfire/i,
    },
    'Steve Cox Memorial Park': { // White Center's park and fields, just over the north line (Jubilee Days, the markets)
      geo: [47.51099, -122.35201],
      area: 'town',
      capacity: 2500,
      type: 'community',
      cssVar: '--v-coxpark',
      color: '#e0e086',
      url: 'https://b-townblog.com/venue/steve-cox-memorial-park-2/',
      icon: 'https://www.google.com/s2/favicons?domain=b-townblog.com&sz=128',
      alias: /steve cox/i,
    },
  };

  // The town's calendars (city-wide feeds, scripts/feeds.mjs): each row keeps
  // its own venue, which folds onto a room above by alias or into Around
  // Burien (groundsVenue). Per entry: kind, label, url, the default type,
  // what to drop by title, and for a Tribe feed `rooms` — a venue test, here
  // a negative one that keeps the away games and the neighbours' halls out.
  var FEEDS = [
    // B-Town Blog's community calendar (WordPress, The Events Calendar REST): the museum, the schools, the parks, the Elks, BAT Theatre
    { kind: 'tribe', label: 'B-Town Blog', url: 'https://b-townblog.com/wp-json/tribe/events/v1/events', // no `type`: each row takes its room's (a game at Memorial Stadium is sports, BAT at Kennedy is arts), the title rules in filter.js over that
      drop: /tutoring|open house|volunteers? needed|gun buyback|membership drive|\brally\b|blood drive|job fair|vaccin|clinic\b|town hall meeting|public (meeting|hearing)|annual .boo in burien|\b(football|soccer|volleyball|basketball|baseball|wrestling)\b.*\bat [A-Z]/i, // notices and civic business, not nights out; Boo in Burien comes from Discover Burien; "Pirates football at Redmond" is an away game
      rooms: /^(?!.*\b(auburn|maple view|maple valley|kent\b|renton|federal way|tacoma|bellevue|puyallup|redmond|issaquah|sammamish|kirkland|lynnwood|everett)\b)/i }, // the Lancers' away games are listed at the other school's field
    // Discover Burien (the chamber, Squarespace): the farmers market, Boo-in Burien, Uncorked, the Pride happy hour
    { kind: 'squarespace', label: 'Discover Burien', url: 'https://www.discoverburien.org/calendar', type: 'community',
      drop: /business after-hours|ribbon cutting|board meeting|luncheon/i },
  ];

  // The filter panel's starting state: every room on, nothing off.
  var DEFAULT_ON = ['Highline Performing Arts Center', 'Burien Town Square', 'Burien Community Center', 'Highline Heritage Museum', 'The Tin Room', 'Kennedy Catholic High School', 'Highline Memorial Stadium', 'Around Burien', 'Des Moines', 'Starfire Stadium', 'Steve Cox Memorial Park'];
  var DEFAULT_OFF = [];
  var PREFS_KNOWN_FROM = null; // no default-off venue yet, so nothing for saved prefs to be told about

  // The event types (the panel's Event Type rows; badges.mjs assigns them).
  var TYPES = [
    { key: 'concert', label: 'Concerts', title: 'Live music — the Tin Room, the tributes and tours at the PAC' },
    { key: 'sports', label: 'Sports', title: 'Seawolves rugby at Starfire, Highline and Kennedy games at Memorial Stadium' },
    { key: 'arts', label: 'Arts & Theater', title: 'The Performing Arts Center, BAT Theatre, the symphony, the museum' },
    { key: 'community', label: 'Community', title: 'The farmers market, the parks, the festivals, the town calendars' },
  ];
  var MOVIE_VENUE = null; // no cinema here

  // Share codes (?f=CODE): REGISTRY is every filterable key in a fixed
  // order and a code is a bitmask over it, so the list is APPEND-ONLY —
  // adding an entry adds a bit and every existing code keeps meaning what
  // it meant; removing or reordering one changes every link out there.
  // 26 slots from the first build (2026-10-16): six base-36 digits.
  var CODE_LENGTH = 6;
  var REGISTRY = [
    ['venue', 'Highline Performing Arts Center'], ['venue', 'Burien Town Square'], ['venue', 'Burien Community Center'], ['venue', 'Highline Heritage Museum'], ['venue', 'The Tin Room'], ['venue', 'Kennedy Catholic High School'], ['venue', 'Highline Memorial Stadium'], ['venue', 'Around Burien'], ['venue', 'Des Moines'], ['venue', 'Starfire Stadium'], ['venue', 'Steve Cox Memorial Park'],
    ['badge', 'concert'], ['badge', 'sports'], ['badge', 'arts'], ['badge', 'community'],
    ['team', 'seahawks'], ['team', 'mariners'], ['team', 'kraken'], ['team', 'storm'], ['team', 'reign'], ['team', 'seawolves'], ['team', 'sounders'],
    ['cap', 'stadium'], ['cap', 'arena'], ['cap', 'hall'], ['cap', 'room'],
  ];

  var WORDS = {
    teamCity: 'Seattle', // the board drops it from the clubs' names ("Seattle Kraken" → Kraken)
    presetDefault: 'Every room — Burien, Des Moines, Tukwila and White Center — every team and type',
    presetNeighborhood: 'Burien only — the Performing Arts Center, Town Square, the community center, the museum, the Tin Room, the schools',
    presetBig: 'Only the places that hold 2,000 or more — Memorial Stadium, Starfire, the Des Moines parks, Steve Cox park',
    phrases: { all: 'Showing everything.', none: 'Showing nothing yet — open Filter and pick some venues.', neighborhood: 'Showing Burien only.', big: 'Showing the big rooms only — the stadiums and the parks.' },
  };

  global.LQACity = {
    key: 'burien',
    name: 'Burien',
    site: 'https://burien.here.events/', // a city-wide site is <city>.here.events (Steve, 2026-10-11); not wired yet — the memory dir's deploy checklist
    userAgent: 'Mozilla/5.0 (compatible; burien-events/1.0; +https://burien.here.events/)',
    tz: 'America/Los_Angeles', tzName: 'Pacific', // the city's time zone: the ICS feed's TZID, the game clocks, the poster's footer
    state: "Washington", stateOutline: 'M6.9 5.6L9.4 5.6L12.6 5.6L15.9 5.6L19.2 5.6L21.6 5.6L21.6 7.4L21.6 9.2L21.7 11.0L21.7 12.8L21.7 14.7L21.6 15.4L21.9 16.3L22.0 16.9L20.0 16.9L18.0 16.9L16.6 16.9L15.5 17.1L13.2 17.9L11.0 18.2L9.8 18.0L8.6 18.4L7.5 18.3L7.0 17.8L6.3 16.3L5.7 16.3L5.2 15.9L4.1 15.9L3.7 15.5L3.8 14.9L4.1 14.4L3.5 13.6L3.7 13.0L3.5 13.3L3.3 12.3L2.6 10.1L2.0 8.7L2.2 7.9L3.6 8.6L5.7 8.9L6.3 9.0L6.7 9.0L7.0 9.0L7.3 9.8L6.9 10.1L6.0 11.4L6.1 11.8L6.6 11.5L6.2 11.4L6.6 10.8L7.1 10.2L7.4 9.6L7.6 10.0L7.3 10.5L7.2 10.8L7.5 11.4L7.4 12.1L7.1 12.0L6.9 11.9L6.5 12.2L6.6 12.6L7.1 12.7L7.5 12.1L7.9 11.9L8.0 11.1L7.9 10.6L8.0 10.3L8.1 9.7L8.3 9.2L7.9 8.7L7.9 9.0L7.6 8.7L7.7 8.3L7.7 7.9L7.3 7.7L7.3 7.5L7.7 7.4L7.6 6.8L7.5 6.4L7.2 6.3Z', // the masthead's small state, linking to here.events (scripts/state-outline.mjs, Natural Earth 1:50m)
    ics: { name: 'Burien Events', short: 'Burien Events', teams: 'Seattle home teams — every season', prodid: '-//here.events//burien-events//EN', uidDomain: 'fosdal.net', // the UID domain the whole family issues (the shared ics test pins it)
      desc: 'Upcoming events around Burien\\, WA — the Highline Performing Arts Center\\, Town Square\\, the town calendars\\, Des Moines and Starfire\\, with the Seattle clubs\' seasons' },
    teams: TEAMS,
    map: { // the Map view (local-map.js; the ground drawn once by scripts/build-local-map.mjs from OpenStreetMap, committed as site/local-map.json) — Steve, 2026-10-25
      kind: 'urban',
      bbox: [47.38, -122.42, 47.53, -122.2], // south, west, north, east — Burien and the Highline towns — Des Moines at the foot, White Center at the top, Starfire at the right
      home: [47.455, -122.36, 47.485, -122.31], // the view at first; the fit button shows the whole frame
      roads: ['motorway', 'trunk', 'primary'],
      tolerance: 0.5,
      labels: [
        { name: 'Burien', lat: 47.4699, lon: -122.3485, anchor: 'end' },
        { name: 'Des Moines', lat: 47.3988, lon: -122.3099, anchor: 'start' },
        { name: 'Normandy Park', lat: 47.4352, lon: -122.3396, anchor: 'end' },
        { name: 'SeaTac', lat: 47.4449, lon: -122.2831, anchor: 'start' },
        { name: 'White Center', lat: 47.5164, lon: -122.3557, anchor: 'start' },
        { name: 'Tukwila', lat: 47.4627, lon: -122.2559, anchor: 'start' },
        { name: 'Puget Sound', lat: 47.455, lon: -122.395, kind: 'water', anchor: 'middle' },
      ],
    },
    venues: VENUES,
    feeds: FEEDS,
    defaultOn: DEFAULT_ON,
    defaultOff: DEFAULT_OFF,
    prefsKnownFrom: PREFS_KNOWN_FROM,
    types: TYPES,
    movieVenue: MOVIE_VENUE,
    groundsVenue: 'Around Burien', // the town calendars' rooms that are not rows of their own
    codeLength: CODE_LENGTH,
    registry: REGISTRY,
    words: WORDS,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
