import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { bundle } from "@remotion/bundler";
import { selectComposition, renderMedia } from "@remotion/renderer";

const REMOTION_PROJECT_ROOT = path.join(process.cwd(), "..");
const ENTRY_POINT = path.join(REMOTION_PROJECT_ROOT, "src", "index.ts");
const PUBLIC_DIR = path.join(REMOTION_PROJECT_ROOT, "public");

// Same sandbox-specific Chrome workaround documented in the remotion skill's
// environment-setup.md — on a normal machine with real internet access, Remotion should
// download its own Chrome successfully and this whole function becomes unnecessary.
function findCachedChrome(): string | undefined {
  const candidates = [
    // process.env.HOME isn't reliable across every process context — check common
    // absolute locations too, not just $HOME (real bug hit during first build).
    path.join(process.env.HOME || "", ".cache/puppeteer/chrome"),
    "/root/.cache/puppeteer/chrome",
    "/home/claude/.cache/puppeteer/chrome",
  ];
  const seen = new Set<string>();
  for (const base of candidates) {
    if (!base || seen.has(base) || !fs.existsSync(base)) continue;
    seen.add(base);
    const versions = fs.readdirSync(base);
    for (const v of versions) {
      const p = path.join(base, v, "chrome-linux64", "chrome");
      if (fs.existsSync(p)) return p;
    }
  }
  return undefined;
}

// Bundling takes a few seconds — cache across requests in this dev server's memory.
let cachedBundleUrl: string | null = null;
async function getBundleUrl(): Promise<string> {
  if (cachedBundleUrl) return cachedBundleUrl;
  cachedBundleUrl = await bundle({ entryPoint: ENTRY_POINT });
  return cachedBundleUrl;
}

async function saveUploadedImage(formData: FormData, key: string): Promise<string> {
  const entry = formData.get(key);
  if (!entry || typeof entry === "string") return "placeholder.jpg";
  const uploadsDir = path.join(PUBLIC_DIR, "images", "uploads");
  fs.mkdirSync(uploadsDir, { recursive: true });
  const ext = path.extname((entry as File).name) || ".jpg";
  const filename = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await (entry as File).arrayBuffer());
  fs.writeFileSync(path.join(uploadsDir, filename), buffer);
  return `uploads/${filename}`;
}

const str = (formData: FormData, key: string) => (formData.get(key) as string) || "";
const json = (formData: FormData, key: string) => JSON.parse((formData.get(key) as string) || "[]");

// Each template's content shape is built here — this is the one place a new template
// needs a case added (see studio/README.md's "adding template #2+" walkthrough).
async function buildContent(templateId: string, formData: FormData) {
  if (templateId === "showcase-card") {
    return {
      type: "ShowcaseCard" as const,
      id: `studio-${Date.now()}`,
      hook: str(formData, "hook"),
      imageFile: await saveUploadedImage(formData, "imageFile"),
      callouts: json(formData, "callouts"),
      cta: str(formData, "cta"),
      musicFile: str(formData, "musicFile") || undefined,
    };
  }
  if (templateId === "price-chart") {
    return {
      type: "PriceChart" as const,
      id: `studio-${Date.now()}`,
      title: str(formData, "title"),
      subtitle: str(formData, "subtitle"),
      unitPrefix: str(formData, "unitPrefix") || undefined,
      points: json(formData, "points"),
      callouts: json(formData, "callouts"),
      heroLabel: str(formData, "heroLabel") || undefined,
      accentColor: str(formData, "accentColor") || undefined,
      sourceText: str(formData, "sourceText") || undefined,
      musicFile: str(formData, "musicFile") || undefined,
    };
  }
  if (templateId === "countdown") {
    return {
      type: "Countdown" as const,
      id: `studio-${Date.now()}`,
      title: str(formData, "title"),
      subtitle: str(formData, "subtitle"),
      unitPrefix: str(formData, "unitPrefix") || undefined,
      items: json(formData, "items"),
      closingText: str(formData, "closingText") || undefined,
      sourceText: str(formData, "sourceText") || undefined,
      musicFile: str(formData, "musicFile") || undefined,
    };
  }
  if (templateId === "tips-carousel") {
    const bulletsRaw = str(formData, "bullets");
    return {
      type: "TipsCarousel" as const,
      id: `studio-${Date.now()}`,
      hook: str(formData, "hook"),
      bullets: bulletsRaw.split("\n").map((b) => b.trim()).filter((b) => b.length > 0),
      cta: str(formData, "cta"),
      musicFile: str(formData, "musicFile") || undefined,
    };
  }
  throw new Error(`Unknown template: ${templateId}`);
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const templateId = formData.get("templateId") as string;
    const content = await buildContent(templateId, formData);

    const browserExecutable = findCachedChrome();
    const serveUrl = await getBundleUrl();

    // selectComposition (not getCompositions) — critical: getCompositions evaluates
    // EVERY registered composition's calculateMetadata with these same inputProps, and
    // other templates' metadata functions throw on a mismatched content shape (real bug
    // hit and fixed here — see references/pitfalls.md if this gets added there).
    const composition = await selectComposition({
      serveUrl,
      id: templateId,
      browserExecutable: browserExecutable ?? undefined,
      inputProps: { content },
    });

    const outputsDir = path.join(process.cwd(), "public", "renders");
    fs.mkdirSync(outputsDir, { recursive: true });
    const outputFilename = `${crypto.randomUUID()}.mp4`;
    const outputLocation = path.join(outputsDir, outputFilename);

    await renderMedia({
      serveUrl,
      composition,
      codec: "h264",
      outputLocation,
      inputProps: { content },
      browserExecutable: browserExecutable ?? undefined,
    });

    return NextResponse.json({ url: `/renders/${outputFilename}` });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err?.message || "Render failed" }, { status: 500 });
  }
}
