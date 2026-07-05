# motion_metrics

Remotion-based motion-graphics/data-viz video generator — built for YouTube Shorts / Instagram Reels content (crypto & stock price charts, population/data explainers, and BiodataBuilder.in brand shorts).

## Structure
```
src/
  Root.tsx              # composition registry — one <Composition> per video
  theme.ts               # BiodataBuilder brand colors/fonts
  fonts.ts                # local @fontsource font loading (see note below)
  content/                # data files per video
  compositions/
    TipsCarousel.tsx       # vertical brand shorts (BiodataBuilder)
    ShowcaseCard.tsx        # vertical template-showcase shorts
    PopulationChart.tsx      # 16:9 data-viz: population by country
    BtcJunePrices.tsx         # 9:16 short: BTC price every June 30
  components/                # reusable pieces (Bokeh, TitleCard, StatCards, etc.)
```

## Sandbox-specific setup notes
This was built inside a network-locked sandbox (no access to `fonts.gstatic.com` or Chrome's own download servers). Two workarounds baked in — keep them if running elsewhere too, since they cause zero downside on a normal machine:
1. **Fonts** via `@fontsource/*` packages (local files) instead of `@remotion/google-fonts` (CDN fetch).
2. **Chrome binary** pointed at a cached Puppeteer Chrome via `remotion.config.ts` / `--browser-executable`. On a normal dev machine, Remotion's own Chrome download should just work — you can likely remove this if you hit no errors.

## Render
```bash
npm install
npx remotion compositions src/index.ts        # sanity check
npx remotion render src/index.ts <composition-id> out/video.mp4
```

## Reference
Full chart-type patterns, decision tables, and reusable component library live in the `remotion` Claude Skill (`/mnt/skills/user/remotion/` in the Claude sandbox) — not duplicated here to avoid drift. Ask Claude to consult it when starting new videos in this repo.
