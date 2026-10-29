# Analytics implementation and verification — October 29, 2026

## Findings
- Repository base: b0806dc7035ecd7500510de57a0c4f0251d37714.
- The real homepage uses src/Homepage.jsx with its own Vercel Analytics component. App.jsx also contains Vercel components and article custom events. An early return in App.jsx alone does not establish a homepage gap.
- public/bai/index.html and several standalone articles had no explicit analytics integration. Some standalone career/catalog pages already load the Vercel script directly.
- The production /_vercel/insights/script.js endpoint serves JavaScript. This verifies script availability only.
- Vercel count and aggregate reporting endpoints returned HTTP 404 “Web Analytics not found” for the correctly identified project prj_t6WHgoc9nUphVSzbWITR0QEw7zI9 and team team_g2Ok3UUIL9ZJ0xci29HXi79G. Historical counts, referrals, and enabled plan features have not been verified. This is not evidence of zero traffic.

## Change
Shared /site-measurement.js is included on public content pages. React pages keep their existing Vercel components. Standalone pages receive a Vercel script only when no explicit script exists. Existing custom article tracking is preserved. Admin pages are excluded from the new layer.

Optional Google Analytics measurement G-BBSDXENED8 loads only after affirmative analytics consent. Ads storage, ads user data, personalization, and Google signals are disabled. Reject is as available as accept. Global Privacy Control and Do Not Track disable Google. Consent expires after 180 days; GA cookies are configured for 90 days. Withdrawal disables GA, expires its site cookies and reloads. Previously transmitted data is not removed. A privacy notice and persistent settings control describe both services.

One explicit GA page_view is sent after acceptance; config automatic pageview is disabled. Only allowlisted, simple UTM labels are retained in the configured Google page location; unknown query parameters and fragments are dropped, and referrer is reduced to origin. Do not put personal data in any URL path or UTM. Existing Vercel React data behavior is unchanged.

Selected events: contact_email_click, demo_click, outbound_click, file_download_click. They record page path and destination hostname/category, never mailto message contents. Standalone pages send these to Vercel; all covered pages send them to Google only after consent. A click is intent, not a completed lead, sent email, or purchase.

## Local validation
- node scripts/test-measurement.cjs: consent default/reject/accept/expiry/withdrawal, GPC, query minimization, one Google pageview, repeat initialization, and no duplicate Vercel injection pass in a simulated DOM.
- npm run build passes. Existing non-module script and large-chunk advisories remain.
- Syntax checked with node --check public/site-measurement.js.
- These are code/build checks, not browser network collection or report-ingestion verification.

## Reports and remaining verification
1. Vercel project → Analytics: https://vercel.com/morbiaus-projects/juanmartinez-ai-site/analytics . Confirm Web Analytics enabled and investigate the reporting API 404 before asserting visitor totals. Use Visitors/Page Views and Pages/Referrers panels. Vercel daily hashes do not support cross-day returning-person counts. UTM reporting may require Web Analytics Plus/Enterprise; no paid upgrade was made.
2. https://analytics.google.com/ → select the property with web-stream measurement G-BBSDXENED8. Realtime should show an accepted test browser; rejected browsers should send no Google requests or analytics cookies. Data stream ownership/settings and report ingestion still require authenticated access.
3. GA Reports → Engagement → Pages and screens, and Events. For returning browsers use Retention (may need adding the Life cycle collection). Acquisition → Traffic acquisition shows source/medium and session campaigns. Allow report processing time; repeat visits require subsequent activity.
4. In GA Admin → Data streams, inspect Enhanced measurement. Disable form interactions, automatic outbound/download tracking, and history pageviews if they would duplicate the explicit events or collect unnecessary data. Confirm Google signals and ads links remain off. Check unwanted-referral settings and data retention. These property settings were not accessible through current tools.
5. Test a campaign URL such as https://www.juanmartinez.ai/bai/?utm_source=linkedin&utm_medium=paid_social&utm_campaign=workflow_assessment&utm_content=creative_a . Do not mix consented GA users with Vercel users or add totals from both systems.
6. Advertising spend/impressions and confirmed leads/revenue are not collected by this change. Import/reconcile spend, and define verified conversion events before claiming advertising ROI. No ad pixels, remarketing, or Ads account linkage was added.
7. boundedagenticai.com and sentinel-reference-demo.vercel.app are separate destinations linked from BAI. This repository change does not instrument them or establish cross-domain journeys; cross-domain tagging requires inspecting their owning projects and Google property configuration.
