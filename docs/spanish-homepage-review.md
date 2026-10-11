# Spanish homepage - draft review, not deployed

## Scope

Add a fully rendered Spanish homepage at `/es/`, with an always-visible English / Espanol language selector, translated estimate form and interactive labels. Preserve the English homepage's existing title, canonical URL, core copy, photos, service pages, analytics IDs and intake destination. Add reciprocal en/es/x-default references, a self-canonical Spanish page and a sitemap entry. No automatic language redirects, paid translation integration, ad changes, hosting changes or changes to the separate app.

The selector warns before discarding unfinished form entries and prevents switching while a submission is in flight. It does not persist personal form contents. Page language is recorded separately from the optional language requested for follow-up. Stable provider field values remain unchanged. Spanish photo selection and required-field messages are localized. Client-side photo checks are not a substitute for backend validation.

Existing English service/city links are labeled as English. Translated review excerpts are identified as translations; the existing video is labeled as English rather than represented as translated. Fluent-human review is still required. The existing hours, phone, license and review information are carried over, not independently re-verified by this change.

The current intake helper saves the central sales inbox first and then attempts the existing Forminit notification. Both scripts remain unchanged. Mock tests show that the new fields are sent; whether the receiver stores and displays those fields still requires live verification.

## Verification completed

- 21 Node static/mocked tests passed, including existing regression tests, reciprocal language tags, canonical URLs, local links, stable fields, script parsing, duplicate-submit prevention and success/failure tracking.
- 16 isolated Chromium layout scenarios: English and Spanish at 320, 390, 720, 768, 1024, 1280, 1440 and 1600 pixels. No document-level horizontal overflow, overlapping header element boxes or JavaScript exceptions in these scenarios. Mobile header and form screenshots reviewed visually.
- 38 isolated Chromium functional assertions passed: required/email validation, photo type/size checks, central-intake and notification mocks, one success event, failure recovery, optional preferred language, dirty-form cancel/accept, in-flight switching guard and mobile menu behavior.
- Fixed a pre-existing regression-test mock that still assumed direct Forminit submission; it now exercises the current JeffElectricIntake call and gtag event. This is a test-harness correction, not a production routing change.

Browser tests rendered the repository HTML and actual styles/scripts in an isolated local DOM with assets inlined. Backend responses, analytics transmission and navigation were mocked. Missing existing workspace font URLs used fallbacks. These results are NOT real iPhone/Safari, live-origin navigation, video-playback, backend-delivery or Google indexing verification. No real customer enquiry was sent.

Run from the repository root:

```sh
python3 scripts/build-spanish-homepage.py
node --test tests/production-homepage.test.mjs tests/public-seo.test.mjs tests/spanish-homepage.test.mjs
node --check language-switch.js
node --check es/mobile-motion.js
node --check es/mobile-motion-legacy.js
git diff --check
```

Translations are maintained in `scripts/build-spanish-homepage.py`. Regenerate after changing the English homepage or the original mobile scripts. Review the printed untranslated-text inventory; proper names and road names intentionally stay unchanged. Commit the generated HTML and scripts together with the source change. No runtime translation service is required.

## Required before release

- [ ] Josh reviews the draft and explicitly approves deployment.
- [ ] A fluent Spanish speaker reviews electrical terminology, reviews, form messages and overall wording.
- [ ] Confirm who handles Spanish-language follow-up. Do not advertise unconfirmed language availability.
- [ ] Verify real iPhone/Safari layout, keyboard, uploads and language navigation against a safe hosted preview; test video and links on the actual origin.
- [ ] Agree on one clearly labeled live test, then confirm central inbox and Forminit delivery, including language and photo handling. Confirm the receiver retains/displays the added language fields or document a separate backend change for approval.
- [ ] Verify GA4 reporting of page paths and successful submissions without duplicate conversion counting; isolate test traffic.
- [ ] Capture a dated Search Console English-performance baseline and operational lead baseline. No demand, ROI or baseline metric is claimed in this draft.
- [ ] Confirm crawlability and metadata on the approved deployed origin and perform a post-release smoke test.

## Deployment and rollback

Production baseline when work began: `a6cdebb501377df0c932d5d3aa4dae32da87ccb1` on `main`. Work is isolated on `feature/spanish-homepage-review`. Opening this draft PR is not deployment approval. Do not merge automatically.

Before an approved merge, re-check main for intervening updates and regenerate/retest as necessary. Record the final release commit. If this change causes a regression, revert the Spanish-release commit(s) through a new reviewed revert commit; do not force-reset main or overwrite unrelated subsequent work. Recheck the existing English form and pages after rollback.
