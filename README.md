# Almaty Travel — redesign

Public demonstration of a redesigned Kazakhstan Travel Agency website. Black, white and orange; Three.js mountain landscape; responsive layouts and GSAP entrance animation.

## Development

Requires Node.js 22.12+.

```sh
npm ci
npm run dev
npm run build
```

Deployed to GitHub Pages by `.github/workflows/pages.yml`. Vite base: `/almaty-travel-next/`.

## Content

`src/content.json` contains 105 pages extracted from the existing site mirror and 14 tour summaries. Images are retained in `public/legacy`. Routes use URL fragments so shared links work directly on GitHub Pages.

The new enquiry form prepares a WhatsApp message; visitors must send it themselves. It does not pretend to submit to a server. Historical descriptions and prices are preserved; current conditions should be confirmed with the agency. External video availability depends on its owner. The stylised 3D terrain is decorative, not a geographic map.

The public demo does not include the original site's tracking scripts. No fabricated reviews or ratings. WebGL fallback and reduced-motion settings are supported. Animation rendering stops when the scene is out of view or the page is hidden.
