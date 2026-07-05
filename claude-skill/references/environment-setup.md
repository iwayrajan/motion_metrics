# New project scaffold checklist

Skip this if a project already exists — just add a new `<Composition>` to it.

## 1. Init

```bash
mkdir -p my-video-project && cd my-video-project
```

`package.json`:
```json
{
  "name": "my-video-project",
  "private": true,
  "scripts": { "start": "remotion studio src/index.ts", "render": "remotion render" },
  "dependencies": {
    "@remotion/cli": "4.0.286",
    "remotion": "4.0.286",
    "react": "18.3.1",
    "react-dom": "18.3.1"
  }
}
```
`npm install`

## 2. tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2018",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"]
}
```

## 3. Fonts (see main SKILL.md — do not use @remotion/google-fonts)
```bash
npm install @fontsource/inter @fontsource/poppins   # add whichever families you need
```
Create `src/fonts.ts` importing the specific weight CSS files you need and exporting plain family-name strings (`"'Inter'"`). Check which weights actually exist before importing:
```bash
ls node_modules/@fontsource/inter | grep -E "^[0-9]"
```

## 4. Chrome binary for rendering
```bash
find / -iname "chrome" -type f 2>/dev/null | grep puppeteer
```
Then `remotion.config.ts`:
```ts
import { Config } from "@remotion/cli/config";
Config.setBrowserExecutable("<path from above>");
```

## 5. Folder structure
```
src/
  index.ts          # registerRoot(RemotionRoot)
  Root.tsx          # <Composition> registry — one entry per video
  fonts.ts
  theme.ts          # colors/fonts constants, one per brand/project
  content/          # data files (types.ts + one file per video's content/dataset)
  compositions/      # one file per video, or per chart-type family
    <ChartName>/
      config.ts       # timing + layout constants for this chart type
      <Parts>.tsx      # sub-components (axis, bars, cards, etc.)
    <ChartName>.tsx    # assembles the parts with <Sequence>
  components/         # cross-project reusable pieces (see assets/components/)
```

## 6. Root.tsx pattern
```tsx
import { Composition } from "remotion";

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="my-video-id"          // this is what you pass to `remotion render <id>`
      component={MyComposition}
      durationInFrames={DURATION}
      fps={30}
      width={1920}   // 1080 for vertical shorts
      height={1080}  // 1920 for vertical shorts
      defaultProps={{ /* if the component takes content as a prop */ }}
    />
  </>
);
```

## 7. First render
```bash
npx remotion compositions src/index.ts     # sanity check — lists all compositions, catches bundling errors early
npx remotion render src/index.ts my-video-id out/my-video.mp4
```

If Chrome/network errors show up mentioning `fonts.gstatic.com` or a Chrome download URL, re-check steps 3 and 4 — these are the two recurring sandbox-specific failure modes.
