// main.ts — bring-the-humans-03 entry program (Node 22, stdlib only).
//
// Reads VIDEO.json from the repository root, checks it parses as JSON,
// and copies its exact bytes into the output directory. That is all it
// does: the house reads the TikTok video itself and writes its counts
// to /output/video.counts.json after this program runs.

import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(repoRoot, "VIDEO.json");

// Read the exact bytes and validate the JSON parses before copying.
const videoBytes = readFileSync(sourcePath);
const parsed = JSON.parse(videoBytes.toString("utf8"));
if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  throw new Error("VIDEO.json must be a JSON object");
}
if (typeof parsed.url !== "string" || parsed.url.length === 0) {
  throw new Error("VIDEO.json must carry a non-empty url string");
}
if (!parsed.url.startsWith("https://www.tiktok.com/")) {
  throw new Error("VIDEO.json url must be a tiktok.com video address");
}

// Create the output directory only when it is missing; never delete it.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

copyFileSync(sourcePath, join(outputDir, "VIDEO.json"));
console.log(`Copied VIDEO.json (${videoBytes.length} bytes) to ${outputDir}`);
