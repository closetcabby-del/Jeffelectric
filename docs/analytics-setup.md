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

## Website calls

The permanent business number remains **(346) 398-4485** in source HTML and
ordinary visits. For eligible Google Ads visitors, the versioned script requests
a Google forwarding number using the existing 60-second conversion action.
It replaces matching visible numbers and tel links only on a valid callback.
Without a callback the permanent number remains. Phone clicks remain secondary.

Run `node --test tests/website-call-tracking.test.mjs` before deployment.
Verify the production site in Tag Assistant and reconcile a received call of
at least 60 seconds with Google Ads call details.

## Forminit enquiries

The English and Spanish homepages send the existing GA4 `generate_lead` event
only after Forminit returns a submission receipt. The photo page uses its
existing Ads conversion destination and the receipt as its transaction ID.
Validate success, rejection and repeated clicks with Google traffic blocked
for fictional submissions. Staff review the forwarded enquiry in ServiceM8.
