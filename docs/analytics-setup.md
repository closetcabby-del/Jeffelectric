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
