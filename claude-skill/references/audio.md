# Audio

## Getting audio files into a project
Local file paths on the person's machine are never accessible to Claude directly — only files uploaded into the chat, or already committed to a cloned repo, exist in the sandbox. Two ways this happens in practice:
1. **Uploaded to chat** → copy into `public/audio/` in the Remotion project → commit to the repo so future chats have it via `git clone` (no re-uploading needed after this one time).
2. **Committed directly to the repo by the person** (e.g. via GitHub web upload) → just `git pull` and it's there. Watch for two things when this happens: (a) files must end up under `public/` specifically — `staticFile()` only resolves paths inside `public/`, so `git mv` anything committed elsewhere (e.g. `src/audio/`) into `public/audio/`; (b) verify each file actually contains audio (`file *.mp3` — web uploads occasionally fail silently and leave a near-empty file) before wiring it into a composition.

## Using it in a composition
```tsx
import { Audio, staticFile, interpolate, useCurrentFrame, useVideoConfig } from "remotion";

const MusicBed: React.FC<{ src: string; volume?: number }> = ({ src, volume = 0.35 }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  // fade in over 20 frames, fade out over the last 30 — avoids an abrupt cut
  const fade = interpolate(
    frame,
    [0, 20, durationInFrames - 30, durationInFrames],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  return <Audio src={staticFile(src)} volume={volume * fade} />;
};
```
Put this once at the top level of the composition (not per-Sequence) so it isn't restarted/retriggered by nested `<Sequence>` boundaries.

## Volume conventions
- **Background bed under a voiceover-free chart video** (our default so far — text/animation only, no narration): 0.3-0.5 is usually fine since nothing needs to duck under it.
- **If a voiceover is ever added**: drop the music bed to ~0.12-0.18 so it sits behind speech, and duck further during any spoken section specifically.

## Matching audio length to video length
Remotion doesn't loop `<Audio>` automatically in all versions — check the installed version's docs before relying on a `loop` prop. The robust, version-agnostic approach: trim with `startFrom`/`endAt` if the track is longer than the video, or if it's shorter and needs to repeat, stack multiple `<Sequence>`-wrapped `<Audio>` tags back to back rather than assuming a loop prop exists.

## Syncing to visual beats (optional, do this only if asked)
For ambient background beds, exact sync isn't necessary. If the person wants hits synced to specific moments (e.g. a swell under the "today's price" callout), find the target frame from the composition's own timing constants (e.g. `CALLOUT_TODAY_START`) and trigger a second, louder `<Audio>` cue or a volume bump at that frame — don't guess timing by ear against the rendered video after the fact.

## Track catalog (motion_metrics repo, `public/audio/`)
These were sourced by the person (filenames suggest Pixabay — verify license terms if reusing elsewhere). All are longer than any single video so far — trim with `startFrom`/`endAt`, don't loop.

| File | Length | Mood / likely fit |
|---|---|---|
| `countdown-149998.mp3` | 58.5s | Tense/ticking build — good for countdown-style rankings, bar chart races |
| `drums-152982.mp3` | 71.9s | Punchy percussion — energetic charts, spring-bounce bar videos |
| `emotional-inspiring-piano-amp-violin-150030.mp3` | 134.3s | Warm/emotional — BiodataBuilder vertical shorts, human-interest content |
| `in-slow-motion-inspiring-ambient-lounge-219592.mp3` | 119.0s | Calm ambient — line graphs, slower data explainers |
| `nature-music-vkroxstarsinger-226067.mp3` | 120.0s | Organic/nature — population/geography content, globe spins |
| `night-detective-226857.mp3` | 116.0s | Moody/noir — crypto crash narratives, dramatic price drops |
| `synthwave-laser-drift-251660.mp3` | 120.0s | Retro-electronic, driving — crypto/stock content generally, bar chart races, futuristic feel |

When asked for a track suggestion, propose 1-2 from this table matching the video's tone (via `ask_user_input_v0` if genuinely unsure between two) rather than defaulting to the same one every time.

**Note**: a `creative-technology-showreel-241274.mp3` upload came through corrupted (2 bytes) and was removed from the repo — if that track is wanted, it needs re-uploading.

## Licensing — ask before assuming
Content going to YouTube/Instagram can get Content ID claims or takedowns from copyrighted music, which is a real risk to a monetization plan. Before using any track:
- If the person supplies their own file, ask where it's from / confirm they have rights to use it — don't assume.
- If they want Claude to suggest something, point to royalty-free sources rather than picking an arbitrary track: YouTube Audio Library (free), Pixabay Music (free), or subscription libraries like Epidemic Sound / Artlist / Uppbeat (attribution/license terms vary by platform — check the specific track's license, don't assume "royalty-free" means "no attribution needed" in every case).
