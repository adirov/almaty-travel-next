# Almaty Travel — redesign

Kazakhstan Travel Agency website redesign. Black, white and orange; a full-screen Three.js mountain landscape; responsive layouts and restrained entrance animations.

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

The new enquiry form prepares a WhatsApp message; visitors must send it themselves. It does not pretend to submit to a server. Historical descriptions and prices are preserved; current conditions should be confirmed with the agency. External video availability depends on its owner. The stylised 3D terrain is decorative, not a geographic map.

The public demo does not include the original site's tracking scripts. No fabricated reviews or ratings. WebGL fallback and reduced-motion settings are supported. Animation rendering stops when the scene is out of view or the page is hidden.
