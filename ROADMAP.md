# Roadmap

This roadmap tracks engineering milestones, performance enhancements, and planned data layers for Izmir Open Data Maps.

---

## Current Release: v1.0.0 (Active)

- [x] Integration of 36 distinct municipal datasets from the Izmir Open Data Portal.
- [x] Marker clustering with `leaflet.markercluster` for dense coordinate points.
- [x] Dynamic tile layers supporting light and dark modes, defaulting to free OpenStreetMap tiles with optional CARTO Basemaps API key support.
- [x] Progressive Web App (PWA) configuration with offline asset caching and installation prompt.
- [x] Client-side dataset export capabilities in PNG, GeoJSON, CSV, JSON, and standalone offline HTML formats.
- [x] User geolocation tracking with permission-based location centring.
- [x] Automated CI quality workflow covering ESLint, TypeScript type checks, and Vitest unit suites.

---

## Near-Term Milestones: v1.1.0

### Performance & Map Rendering
- [x] Migrate heavy raster layer clustering to WebWorker processing for datasets exceeding 2,000 coordinates.
- [x] Implement viewport-based coordinate bounding to avoid rendering off-screen markers.
- [x] Add offline caching strategy for frequently viewed municipal categories.

### Interface & Accessibility
- [x] Full keyboard navigation support for the map marker list drawer.
- [x] High-contrast accessibility themes meeting WCAG 2.1 AAA contrast ratios.
- [x] Route calculation and transit link suggestions to selected locations.

---

## Future Consideration: v1.2.0

### Data Layer Expansion
- [ ] Real-time municipal transit feeds (bus arrival times and BISIM bike rental availability).
- [ ] Earthquake and emergency gathering zone offline data packs.
- [ ] Vector tile migration via MapLibre GL for client-side styled map rendering.

---

## Suggesting New Milestones

To suggest a dataset or architectural improvement, open an issue using the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.yml).
