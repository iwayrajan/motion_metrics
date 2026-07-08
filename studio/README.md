# Motion Metrics Studio

A config-driven web UI for generating videos from the Remotion templates in `../src`, without needing a chat/LLM in the loop for each video.

**How it works**: pick a template → fill in a form (generated from that template's schema) → click Generate → the server bundles the Remotion project, renders with your submitted content, and gives you back an mp4.

## Setup (run this on your own machine)

```bash
cd studio
npm install
npm run dev
```
Then open http://localhost:3000.

### One-time Chrome check
Remotion needs a Chrome binary to render. On a normal machine with internet access, it should download its own the first time you render — you likely don't need to do anything. If you hit a Chrome-download error:
1. Install Chrome/Chromium normally, or let Puppeteer's own installer grab one: `npx puppeteer browsers install chrome`
2. If it's still not found automatically, hardcode the path in `app/api/render/route.ts`'s `findCachedChrome()` function (there are already a few common paths checked — add yours if it's somewhere else).

This was originally built in a network-locked sandbox (hence the multiple fallback paths in that function) — on your own laptop this should mostly just work without extra config.

## Adding template #2 (and beyond)
1. Build the Remotion composition in `../src/compositions/` as usual (with a `calculateMetadata` on its `<Composition>` registration in `../src/Root.tsx` if its duration varies with content — see `showcase-card`'s registration as the pattern to copy).
2. Add one entry to `lib/templates.ts`'s `templates` array describing its form fields.
3. Add a `case` in `app/api/render/route.ts`'s template-id check for how to build that template's `content` object from the submitted form data.

The gallery page and the form page are both already generic — they read from `lib/templates.ts`, so neither needs to change for a new template.

## Known limitations (MVP, template #1 only)
- Bundling is cached in-memory per server process — restart the dev server if you change any Remotion composition code, otherwise it'll keep rendering the old bundle.
- No render queue — concurrent submissions will bundle/render serially inside one Node process. Fine for personal use; would need a real job queue (e.g. BullMQ) before this is a multi-user product.
- Images/logos are stored on local disk (`../public/images/uploads/`) — fine for personal use; swap for S3/Cloudinary if this ever needs to run somewhere other than your own machine.
- Only `showcase-card` is wired up so far — this was the "prove the pattern" template. See the remotion skill's `references/studio-architecture.md` for the plan to add the other 9.
