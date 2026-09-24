# Public website SEO and enquiry update

Related: issue #3. Scope: root static HTML served by GitHub Pages; no changes to the separate app or deployment settings.

## Changes and rationale

- Add a homepage canonical URL and Open Graph metadata.
- Use one stable Organization identifier across the homepage, service pages and location pages. Service and CollectionPage entities refer to that organization. Existing Electrician entities had no address. Google requires a physical address for LocalBusiness rich-result eligibility; this implementation uses general Organization/Service markup without inventing a public location. This is not a claim of LocalBusiness rich-result eligibility or a guarantee of higher rankings.
- Shorten Pearland and generator titles. Add practical request-preparation information to existing pages, plus contact links and 7 AM–7 PM daily hours.
- Add an email field required when Email is the chosen reply method. Preserve the existing Forminit form and phone normalization.
- Confirm a submission identifier before displaying success or sending generate_lead; reject empty responses and guard duplicate in-flight submissions.
- Add phone_click separately from generate_lead. Custom events contain only page_path, never contact details or message content. Phone clicks do not establish completed calls; submitted enquiries are not automatically qualified leads or booked jobs.
- Carry allowlisted UTM fields between pages within the browser tab and include them as Forminit text fields. No full URL or arbitrary query parameters are copied by this script. This supplements the SDK's URL tracking.
- Remove an outdated homepage lastmod rather than publishing an invented modification date.

## Verification completed

Run:

```sh
node --test tests/production-homepage.test.mjs tests/public-seo.test.mjs
node --check lead-tracking.js
git diff --check
```

All 11 automated tests pass. Checks cover local links and canonical URLs for every sitemap page, JSON parsing/entity references, script syntax, existing homepage protections, mocked submission success and failure, campaign persistence, and custom-event behavior when analytics/storage are blocked. These are local code tests, not an external schema validation certificate.

## Remaining review and account checks

- Mobile and desktop visual/browser UAT remains pending. The available remote browser could not reach the local preview; local browser installation also failed. No screenshots or live submission verification are claimed.
- Use a controlled test enquiry to verify Forminit delivery and the added email/campaign fields after staging or approved deployment. Backend delivery and dashboard reporting were not tested here.
- Check GA4 DebugView and key-event configuration with authorized account access. Avoid counting automatic form_submit and generate_lead as two conversions for the same enquiry.
- Reconcile qualified enquiries, completed calls, and booked jobs in operational reporting; these cannot be inferred from browser events alone.
- Run Schema.org Validator and applicable Google Rich Results tests on the deployed changes, then re-audit. General Service markup does not itself establish Google rich-result eligibility.
- Search Console indexing and account-based position tracking require separate access checks. No campaign settings were changed.
- HSTS is a hosting-level consideration; no header or hosting changes are included. No llms.txt or ad launches are included.

## References

- [Google LocalBusiness requirements](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- [Schema.org Service](https://schema.org/Service)
- [Forminit SDK response and field format](https://forminit.com/docs/sdk/)
