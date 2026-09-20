# Decision X-Ray: verified cutaway rebuild

Review date: September 20, 2026. Preview branch: `feature/decision-xray-2-20260920`.

## What changed

The opaque sphere was replaced with individually modeled graphite shell panels, a permanent forward aperture, nested machined assemblies, radial bridges, gear trains, an amber D07 authority core, and a cyan section plane. Three.js 0.180.0 is pinned and bundled locally; no runtime CDN or paid generation service is required.

Use `?view=decision-xray` for the dedicated full-width review. The homepage also has a full-width model instead of forcing the instrument into a narrow sidebar.

One renderer is retained across mode changes. Canvas CSS dimensions match its viewport. The camera is fitted on resize. Pause, keyboard inspection, reduced motion, resource cleanup and a WebGL-unavailable fallback are implemented. Scanning, exploded assemblies, route removal and simulated approval affect the real scene.

## Verification

`acceptance.json` records 19 passing checks in headless Edge 153.0.4234.32: moving frames, pause stability, one canvas across repeated mode changes, approval simulation, keyboard inspection, 320/390/768-pixel layouts, reduced motion, no-WebGL fallback and unexpected errors. A 1440-pixel desktop capture was also inspected.

`firefox-result.json` records Firefox 141.0 motion, mode-switching, mobile-overflow and page-error checks. These are browser viewport tests, not physical-phone or every-version tests.

The PNGs are screenshots of the actual application, not generated illustrations. Lint and production build passed. Existing analytics notices and a lazy-loaded 3D-chunk size advisory remain (about 546 kB minified / 140 kB gzip). The previous dependency audit findings are outside this visual change.

## Scope

This is a synthetic strategic-partnership authorization example. No live risk rating or operational runtime enforcement is claimed. Simulating approval executes no business action and connects to no client system.

This branch does not promote production. The prior illustration is an art-direction reference, not a pixel-identical or photorealistic guarantee for the browser renderer.
