# Website Analytics

The public website uses the Jeff Electric GA4 property `554710159`, web stream
`15792373595`, and measurement ID `G-4BK4Q6NXD6`.

The tag is included in the 17 public HTML pages and the source layout in
`app/layout.tsx`. Google verification files and the image fallback document are
not visitor-reporting pages. When adding or regenerating public HTML, preserve
one tag loader and one configuration call per page. The measurement ID is a
public identifier, not an API credential.

## Release verification

This change is prepared for review. It is not live until merged and the website
deployment completes. After publication:

1. Verify the production HTML contains the intended measurement ID once in the
   loader and once in its configuration.
2. Visit the homepage and a nested page in a normal browser with tracking
   allowed; verify the events reach the intended property's Realtime report.
3. Verify the next Apps Script extraction. The collector currently reports the
   preceding 28 completed days, so a visit today will not appear in that export
   until a later reporting day.

The GA4-to-Sheets/Drive collector has successfully retrieved and archived empty
reports under Josh's Google account. Populated website reporting has not yet
been verified. Meta credentials and the recurring collector trigger are still
pending. Platform events do not establish completed jobs or revenue; reconcile
those against downstream business records.

Rollback: revert the tag commit and republish the same website. That stops new
browser collection from these pages; it does not delete previously collected
Analytics data.

## Google Ads website calls — 2026-10-17

Account: `856-409-6133`. Action: **Website phone call - 60 seconds**
(ID `7853180794`), source Calls from website visits, Primary, One per interaction,
60-second minimum, 30-day click window, no assigned monetary value.
Destination: US `3463984485`; display match: `(346) 398-4485`.
Verified snippet target: `AW-18475284552/1mtNCPqO2KAdEMjw2elE`.

`website-call-tracking.js` requests Google's forwarding number and updates both
visible numbers and matching `tel:` destinations. It handles links inserted by
mobile enhancements or form confirmation messages. Without an eligible ad visit,
a returned number, or functioning analytics, the original number remains usable.
The script does not emit completed-call events: Google qualifies calls using the
forwarding number and the action's duration setting. Structured data and form
contents remain untouched. Existing GA4 `generate_lead`, secondary `phone_click`,
and the separate photo-submission conversion remain unchanged.

GitHub Pages serves the root static HTML. All 18 public pages with phone links
load this script. The alternate app layout and public asset also include it to
preserve behavior in a future app build. Spanish regeneration preserves the
loader. Keep the root and `public/` script copies identical.

Validation: `node --test tests/website-call-tracking.test.mjs
 tests/production-homepage.test.mjs tests/public-seo.test.mjs
 tests/spanish-homepage.test.mjs` (run as one command). Includes callback-based
replacement, mobile CTA destinations, dynamic links, fallback behavior, duplicate
load protection, and existing form success/failure regressions. Mocked callback
checks do not prove an attributed phone call reached Google Ads.

After publication, check the live homepage and a nested page, then use an
eligible real ad-origin session to verify that a Google forwarding number is
issued, dial it and maintain the connected call beyond 60 seconds. Verify the
call/conversion after Google's reporting delay. Do not fabricate a GCLID or emit
a synthetic conversion event. No paid test click or live call was performed by
the automated regression suite.

Rollback: revert this call-tracking commit and republish. Existing lead tracking
continues; the Ads action can be retained for its history.
