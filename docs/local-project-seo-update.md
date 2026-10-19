# Residential search and project-content update

The static public site is served by GitHub Pages from the repository root. The separate app is not changed.

- Clarify the English and Spanish homepage H1 with residential electrician and Southeast Houston wording; expand the homepage search description.
- Add practical planning questions to five existing service pages and differentiated project-preparation guidance to four city pages. Do not claim a photographed job's city, inspection result, price, completion date or scope that the source does not establish.
- Add `/our-work.html`, link it from the homepage, services and city/service pages, and include it in the sitemap.
- Restore the old `/home` route with an immediate HTML redirect to `/` and a homepage canonical. GitHub Pages does not provide a configurable server-side 301 for this route. Verify the redirect in the browser and request Search Console validation after deployment.
- Use three original Drive photos, converted to WebP at up to 1000 px wide, with embedded metadata removed. Photo markup includes descriptive alt text, dimensions and lazy loading. The open panel and generator images are labeled as work/equipment photos, without claiming final inspection or a completed condition.

## Photo provenance

Originals remain in the user's Drive. Only optimized website assets are added here.

| Website asset | Source Drive file ID | Source filename |
| --- | --- | --- |
| `public/work/home-ev-charger.webp` | `1G-LPxkUhaRfxHianfTmYrjBQ7yK0S6f1` | `IMG_4616.HEIC` |
| `public/work/residential-panel-work.webp` | `1Lwf8WIjL8FrdWKGB9NwuFx4nPd3bdhzV` | `IMG_5067.HEIC` |
| `public/work/home-generator-equipment.webp` | `1zFywQyrDOdmOjQ_3iJ0H02E7xukqd8ci` | `IMG_2391.HEIC` |

## Validation

Run `python scripts/build-spanish-homepage.py` and the existing homepage, public SEO, Spanish homepage and website call-tracking Node test files. All 24 checks passed locally. Image links, alt text and dimensions were checked, and `git diff --check` passed. Live visual inspection and Search Console requests are deployment follow-ups, not established by these tests.

The existing sitemap was already successfully submitted in Search Console. Indexing is controlled by Google; a sitemap or indexing request does not guarantee inclusion. Automatic Google review synchronization is separate and is not implemented by this change.
