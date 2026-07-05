# Mobile (vertical) vs desktop (landscape) design profiles

Everything built so far (Population Chart, BTC short) reused the same visual energy regardless of format. That's wrong — a 1080×1920 Short competing for attention in a fast-scrolling feed needs a different design language than a 1920×1080 explainer. Treat these as two profiles, not one style scaled to different aspect ratios.

## Why this matters
Shorts/Reels are watched thumb-scrolling, sound often off at first, 3+ videos deep into a feed. The video has under ~1 second to signal "stop scrolling" before it's gone. A clean/editorial desktop look (like Population Chart) reads as slow and safe in that context — it needs to read as **alive** within the first frame.

## Platform safe zones (mobile only)
Reels/Shorts/TikTok overlay UI on top of the video: username + caption near the bottom-left, like/comment/share/follow buttons on the right edge, sometimes a progress bar at the very top. Keep primary text and chart elements out of:
- **Right edge**: ~150px inset (action buttons)
- **Bottom**: ~300-350px (caption text + username)
- **Top**: ~150px (progress bar / status elements on some platforms)
This isn't exact for every platform/placement, so when it matters (text near an edge), err generous with margins rather than assuming a precise pixel boundary — verify against the target platform's current safe-zone guidance if the client needs precision (e.g. for a paid placement).

## Design profile comparison

| Aspect | Desktop / landscape (16:9) | Mobile / vertical (9:16) |
|---|---|---|
| **Type scale** | Data labels 13-18px, headlines 44-72px | Data labels 20-28px minimum (small preview thumbnails need to stay legible), headlines 56-90px |
| **Motion energy** | Heavy/settled springs (`damping: 75`), editorial pacing, generous holds | Snappier springs with visible overshoot (`damping: 10-16, mass: 0.4-0.6`), faster cuts, less dwell time |
| **Opening hook** | Title card can fade in calmly over ~2s | Something must be *moving* within the first ~15 frames (0.5s) — don't spend the first second on a static title; have the chart already animating in, or the title itself doing something kinetic (scale-punch, not just fade) |
| **Items on screen** | Can show 8-10 data points (Population Chart showed 10 country bars) | Cap at 4-6 — cycle/paginate through more if needed, don't cram |
| **Card placement** | Horizontal row, side by side (Population Chart's 3 continent cards) | Stacked vertically, full-width, one focal card at a time rather than a row (Population's horizontal-row pattern doesn't fit a 1080px-wide canvas at readable size) |
| **Color/contrast** | Can be more restrained/editorial | Higher contrast, more saturated accent colors — needs to pop as a thumbnail |
| **Preferred techniques** (from `animation-techniques.md`) | Clean line/area tracing, plain glow-pulse callouts, heavy-settle bars | Spring-bounce bars, odometer counters for hero numbers, HUD-style glassmorphism callouts, idle-bob on any static elements — lean into the "fancy" techniques by default here |

## What "fancy" concretely means for mobile (apply by default, not just when asked)
- **Overshoot everything that moves.** A card that slides up and stops dead reads as flat; one that overshoots ~8-10% and springs back reads as alive. Use `springs.bounceIn` (`damping: 60, stiffness: 120`) as the mobile default instead of `springs.uiPopIn`.
- **Layer motion, don't single-task it.** While a headline is animating in, something else (a background gradient shift, particles, a subtle scale pulse) should also be moving — mobile viewers read stillness as "did this freeze?"
- **Big numbers deserve an odometer**, not a plain count-up, per `animation-techniques.md` #3 — this is the single highest-impact swap for making a stat feel premium on mobile.
- **Faster stagger**: 6-9 frames (0.2-0.3s) between staggered items on mobile vs. 12-15 frames (0.4-0.5s) on desktop — the tighter rhythm feels more energetic on a smaller screen watched quickly.
- **Punch-in on reveal**: scale from ~92% to 100% with a slight overshoot on anything appearing (cards, callouts, value labels), rather than a plain fade — a fade alone under-performs on mobile.

## When building a new mobile short
Explicitly pick spring configs and stagger timing from the mobile column above rather than reusing whatever was used on the last desktop piece — this is a common way the two profiles blur together by accident (copy-pasting a component from a landscape composition without re-tuning its motion).
