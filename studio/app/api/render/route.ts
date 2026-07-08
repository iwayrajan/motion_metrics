import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { bundle } from "@remotion/bundler";
import { getCompositions, renderMedia } from "@remotion/renderer";

// Path to the actual Remotion project this studio app renders from — one level up.
const REMOTION_PROJECT_ROOT = path.join(process.cwd(), "..");
const ENTRY_POINT = path.join(REMOTION_PROJECT_ROOT, "src", "index.ts");
const PUBLIC_DIR = path.join(REMOTION_PROJECT_ROOT, "public");

// Same sandbox-specific Chrome workaround documented in the remotion skill's
// environment-setup.md — on a normal machine with real internet access, this can likely
// be removed entirely (Remotion will download its own Chrome successfully).
function findCachedChrome(): string | undefined {
  const candidates = [
    // process.env.HOME isn't reliable across every process context (observed /root here
    // instead of the actual user's home) — check common absolute locations too, not just $HOME.
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

// Bundling takes a few seconds — cache it across requests in this dev server's memory
// rather than re-bundling on every single render.
let cachedBundleUrl: string | null = null;
async function getBundleUrl(): Promise<string> {
  if (cachedBundleUrl) return cachedBundleUrl;
  cachedBundleUrl = await bundle({ entryPoint: ENTRY_POINT });
  return cachedBundleUrl;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const templateId = formData.get("templateId") as string;

    if (templateId !== "showcase-card") {
      return NextResponse.json({ error: `Unknown template: ${templateId}` }, { status: 400 });
    }

    const hook = (formData.get("hook") as string) || "";
    const cta = (formData.get("cta") as string) || "";
    const musicFile = (formData.get("musicFile") as string) || undefined;
    const calloutsRaw = (formData.get("callouts") as string) || "[]";
    const callouts = JSON.parse(calloutsRaw) as { text: string; top: number }[];

    // Save the uploaded image into the Remotion project's actual public/ folder —
    // staticFile() resolves relative to THAT project, not this studio app's public/.
    const imageEntry = formData.get("image");
    let imageFile = "placeholder.jpg";
    if (imageEntry && typeof imageEntry !== "string") {
      const uploadsDir = path.join(PUBLIC_DIR, "images", "uploads");
      fs.mkdirSync(uploadsDir, { recursive: true });
      const ext = path.extname((imageEntry as File).name) || ".jpg";
      const filename = `${crypto.randomUUID()}${ext}`;
      const buffer = Buffer.from(await (imageEntry as File).arrayBuffer());
      fs.writeFileSync(path.join(uploadsDir, filename), buffer);
      imageFile = `uploads/${filename}`;
    }

    const content = {
      type: "ShowcaseCard" as const,
      id: `studio-${Date.now()}`,
      hook,
      imageFile,
      callouts,
      cta,
      musicFile,
    };

    const browserExecutable = findCachedChrome();
    const serveUrl = await getBundleUrl();

    const compositions = await getCompositions(serveUrl, {
      browserExecutable: browserExecutable ?? undefined,
      inputProps: { content },
    });
    const composition = compositions.find((c) => c.id === "showcase-card");

    if (!composition) {
      return NextResponse.json({ error: "Composition 'showcase-card' not found" }, { status: 500 });
    }

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
