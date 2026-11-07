# Borewell Drilling Company Website

React + TypeScript + Tailwind + Framer Motion + React Router + React Hook Form (zod).

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build into /dist
npm run preview
```

## 1. Make it yours (do this first)
Everything company-specific lives in **`src/config/site.ts`**: name, city, phone, WhatsApp, email,
address, hours, map embed URL, social links and the hero statistics. Items marked `PLACEHOLDER` must be replaced.

| What | Where |
|---|---|
| Services (text, slugs) | `src/data/services.ts` |
| Machinery gallery | `src/data/equipment.ts` |
| Projects (location, depth, type) | `src/data/projects.ts`, replace the `isSample: true` entries with real ones |
| Testimonials | `src/data/content.ts`, replace the sample entries with genuine reviews you have permission to publish |
| FAQs, process steps, "why us" | `src/data/content.ts` |
| Service-area landing pages | `src/data/cities.ts` → `/borewell-drilling-in/<slug>`; list only areas you serve |
| Images | `src/data/images.ts`; put real photos in `public/images` and update the paths |

Sample projects and testimonials show a visible **Sample** tag until you set `isSample: false`.
**Real photos:** put your photos in `photos/` named after their slot (see `photos/README.md`) and run `npm run photos`.

The shipped images are generated illustrations (WebP in `public/images`, sources in `scripts/generated-svg`, regenerate with
`node scripts/generate-images.mjs`, which needs `brew install librsvg webp`). They are stand-ins: replace them with real photos of your own
rigs and projects (same filenames, or update `src/data/images.ts`). Social previews use `public/images/og-image.jpg` (1200×630); swap it for your own too.

## 2. Enquiry form backend (Supabase)
1. Create a Supabase project, run `supabase/schema.sql` in the SQL editor.
2. Copy `.env.example` → `.env` and fill `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Enquiries appear in the `enquiries` table. The anon key can **insert only** (row-level security).

Without these variables the form still validates, then offers the visitor a pre-filled WhatsApp / email message,
so no lead is lost during setup.

## 3. Deploy
- **Vercel / Netlify:** import the repo; build command `npm run build`, output `dist`. SPA rewrites are already in `vercel.json` / `netlify.toml`.
- Set `VITE_SITE_URL` (your real domain) so canonical URLs, `sitemap.xml` and structured data are correct. Add the Supabase variables in the host's environment settings.

## SEO
Per-page titles/descriptions/canonicals (`src/seo/Seo.tsx`), LocalBusiness + FAQ + Service + Breadcrumb JSON-LD (`src/lib/seo.ts`),
`sitemap.xml` and `robots.txt` generated at build time. For best local ranking, claim a Google Business Profile and keep NAP (name, address, phone) identical to `site.ts`.

## Tests
```bash
npm test               # run all tests once (373 tests, ~10s)
npm run test:watch     # re-run on change
npm run test:coverage  # coverage report in the terminal + coverage/index.html
```
- `src/test/unit/` has one test file per area: `validation`, `enquiry` (+ `enquiry.supabase`), `seo`, `scroll-and-config`, `data`, `hooks`, `ui`, `layout`, `sections`, `enquiryForm`, `pages`, `branches`, `art`, `seoFiles`.
- `src/test/site.test.tsx` holds end-to-end route, link and form checks across the whole app.
- Tests run in jsdom. Animations are disabled and `IntersectionObserver`/`matchMedia` are stubbed in `src/test/setup.ts`.
- When you add a service, city or FAQ, the data tests check slugs are unique, images exist and routes/sitemap stay consistent.

## Languages (English + ಕನ್ನಡ Kannada)
A **EN | ಕನ್ನಡ** switcher sits in the menu bar. The choice is remembered; first-time visitors whose browser is set to Kannada get Kannada automatically,
and a link like `https://yoursite.com/?lang=kn` opens the site in Kannada.

- English text is the translation key: `t('Get a Free Quote')`. A missing translation falls back to English, so nothing ever breaks.
- Translations live in `src/i18n/kn.general.ts` (site text, services, FAQs) and **`src/i18n/kn.company.ts`** (your company name, city, address,
  hours, sample projects/testimonials). When you replace a placeholder in `src/config/site.ts` or the data files, add a matching line to `kn.company.ts`
  (`"Mysuru": "ಮೈಸೂರು"`). Without it that text simply shows in English in Kannada mode.
- Use a zero-width non-joiner (`‌`) before suffixes after a final virama, e.g. `ಬೋರ್‌ವೆಲ್‌ಗಳು`, so letters don't join oddly.
- `npm test` fails if any string used in the site has no Kannada entry, or if a Kannada page still shows English phrases.
- The Kannada text is a careful first draft: **have a native Kannada speaker review it before launch.**
- Not translated (by design): the WhatsApp/email message sent *to the business*, structured data for search engines, and phone/email.
