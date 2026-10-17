# Burien Events

Event feed and calendar for Burien, WA — the Highline Performing Arts Center,
Burien Town Square and the Thursday farmers market, the community center, the
Highline Heritage Museum, the Tin Room, BAT Theatre at Kennedy Catholic and the
district's Memorial Stadium, with Des Moines, Starfire Stadium in Tukwila and
White Center's Steve Cox park over the city line — and the Seattle clubs'
seasons (Seahawks, Mariners, Kraken, Storm, Reign, Seawolves, Sounders) in a
Teams view.

Live at **https://burien.here.events/** once the domain is wired (GitHub Pages,
built by the Actions workflow once a day at noon Pacific).

A sister of lqa-events, built the way Port Angeles and Pioneer Square were:
everything that makes this Burien's is `site/city.js` (every team, venue, type,
default, feed, share-code registry and string), `site/index.html`,
`scripts/fetch-events.mjs` (the sources, among them the Highline PAC page
parser), `site/embed.js`, `outlook.json`, `scripts/data/postseason.json`,
`channels.json`, the manifest and icons (Three Tree Point — three firs on the
spit over the Sound — rendered from `favicon.svg`). Everything else is
lqa-events' own, byte for byte — copy from there, never edit here.

## Embed

```html
<div id="burien-events"></div>
<script src="https://burien.here.events/embed.js" data-max="8" defer></script>
```

## Sources

- **Highline Performing Arts Center** — its own events page (highlinepac.org/events, a
  hand-laid Wix page): `parseHighlinePac` in `scripts/fetch-events.mjs` pairs each
  date line with the nearest title and takes the TICKETS button as the link.
- **B-Town Blog** — the town's community calendar (WordPress, The Events Calendar REST
  at b-townblog.com/wp-json/tribe/events/v1/events) as a city-wide feed (city.js
  `feeds`, the shared `tribe` kind): rows fold onto the rooms by alias or into Around
  Burien; notices, civic business and the Lancers' away games are dropped.
- **Discover Burien** — the chamber's Squarespace calendar (discoverburien.org/calendar,
  `?format=json`): the farmers market at Town Square, Boo-in Burien, Uncorked, the
  Pride happy hour at the Tin Room.
- **City of Des Moines** — the CivicPlus calendar RSS (desmoineswa.gov) on the Des
  Moines row through the shared `cards` kind; council, commission and board
  meetings dropped; an all-day row keeps no clock.
- **Ticketmaster Discovery API** — the Highline PAC's and Starfire's venue records,
  read by id every build (both empty on 2026-10-16). Church events are left out
  (`isChurch`). Calls are paced 1.5 s apart with a 429 back-off, since the sister
  builds share the key.
- **Seasons** — ESPN for the Seahawks, Storm, Reign and Sounders; MLB's stats API for
  the Mariners; the NHL's for the Kraken; the Seawolves' own site for Major League
  Rugby (`scripts/schedules.mjs`, shared with lqa). The six Seattle clubs are
  Teams-view-only; the Seawolves' home matches at Starfire are written into the
  listing (city.js `inject`).

Not readable yet: BAT Theatre's own site (a reCAPTCHA wall), the Tin Room's
SpotHopper page (no calendar in the HTML), the City of Burien's own calendar
(committee meetings only).

## Local run

```sh
cp .env.example .env   # TICKETMASTER_API_KEY=…
ALLOW_NO_ARCHIVE=1 node scripts/fetch-events.mjs   # ALLOW_NO_ARCHIVE only until the site has published once
node --test scripts/*.test.mjs
```
