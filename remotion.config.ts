import { Config } from "@remotion/cli/config";

// Sandbox network is locked down and can't download Chrome itself,
// so we point Remotion at the Chrome binary Puppeteer already cached.
// (Not needed if you run this on your own machine later.)
Config.setBrowserExecutable(
  "/home/claude/.cache/puppeteer/chrome/linux-131.0.6778.204/chrome-linux64/chrome"
);
