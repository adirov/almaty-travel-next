# Almaty Travel — redesign

Kazakhstan Travel Agency website redesign. Black, white and orange; an original photograph of Charyn Canyon with a subtle Three.js depth effect; responsive layouts and restrained entrance animations.

## Development

Requires Node.js 22.12+.

```sh
npm ci
npm run dev
npm run build
```

Deployed to GitHub Pages by `.github/workflows/pages.yml`. Vite base: `/almaty-travel-next/`.

## Content

`src/content.json` contains 118 content entries, including the original site mirror, 14 tour summaries and added English versions for missing albums and Oi Qaragai. Images are retained in `public/legacy`. Routes use URL fragments so shared links work directly on GitHub Pages.

Russian and English share the same page templates. Switching language retains the current route, catalogue filters and enquiry draft. The home page keeps its existing WebGL canvas while its text changes. `src/routing.js` defines canonical bilingual routes. Run `npm test` to check route round trips, translation coverage and removal of decorative/editor metadata; these checks also run before deployment.

The new enquiry form prepares a WhatsApp message; visitors must send it themselves. It does not pretend to submit to a server. Historical descriptions and prices are preserved; current conditions should be confirmed with the agency. External video availability depends on its owner.

The public demo does not include the original site's tracking scripts. No fabricated reviews or ratings. The hero photo comes from the agency's existing Charyn gallery. Its depth-weighted image movement is intentionally subtle; it is not a reconstructed 3D scan. A static copy remains visible while the effect loads, if WebGL is unavailable or if reduced motion is requested. Animation rendering stops when the scene is out of view or the page is hidden.

