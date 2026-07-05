// Fonts are bundled locally via @fontsource (npm packages that ship the actual
// .woff2 files) rather than fetched from Google's CDN at render time — this
// sandbox's network doesn't allow calls out to fonts.gstatic.com. If you move
// this project to your own machine with normal internet access, this still
// works fine (arguably better: no CDN dependency, faster renders).

import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";

import "@fontsource/cormorant-garamond/500-italic.css";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";

export const fontFamilies = {
  display: "'Playfair Display'", // elegant serif — headlines (biodata brand)
  body: "'Poppins'", // clean sans — bullets, UI text (biodata brand)
  accent: "'Cormorant Garamond'", // italic serif — eyebrow labels, small accents (biodata brand)
  data: "'Inter'", // clean grotesk — data-viz / chart projects
};
