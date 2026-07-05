import { fontFamilies } from "./fonts";

// Central place to tweak brand look & feel.
// Change these and every video re-renders with the new style.

export const theme = {
  colors: {
    bgDark: "#22050F", // near-black maroon, base background
    bgDark2: "#4A0F26", // lighter maroon for radial glow center
    gold: "#C89A4C", // primary gold
    goldLight: "#EAD3A0", // highlight gold, used for glows/shimmer
    ivory: "#F8EDE3", // primary text on dark bg
    ivoryMuted: "rgba(248,237,227,0.62)", // secondary/eyebrow text
    line: "rgba(200,154,76,0.45)", // hairline dividers
  },
  fonts: fontFamilies,
  brand: {
    name: "BiodataBuilder.in",
    handle: "@biodatabuilder.in",
  },
};
