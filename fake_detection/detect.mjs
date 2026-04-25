#!/usr/bin/env node

/**
 * Fake Image Detection MVP
 *
 * Detects if a plant photo was taken directly from a real scene
 * or re-photographed from a screen, monitor, printout, or poster.
 *
 * Usage:
 *   node detect.mjs <image-path-or-url>
 *   node detect.mjs ./samples/real-plant.jpg
 *   node detect.mjs https://example.com/plant.jpg
 */

import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";

// ── Config ──────────────────────────────────────────────────────────

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

const SYSTEM_PROMPT = `You are an image authenticity analyzer specialized in detecting recaptured images.

Your task: Determine if the provided image is a REAL photo taken directly with a camera, or a RECAPTURED image (a photo of a screen, monitor, phone display, printout, magazine, poster, or any other secondary source).

Analyze these visual signals:

SCREEN RECAPTURE indicators:
- Moiré patterns (wavy interference lines from photographing a pixel grid)
- Visible pixel/sub-pixel structure (RGB dots visible at edges)
- Screen reflections, glare spots, or light bleeding
- Screen bezels or device edges visible (even partially)
- Color banding or posterization from limited display color depth
- Uneven brightness (brighter center, darker edges typical of screens)
- Refresh line artifacts or scan lines
- Warped/curved perspective from angled screen capture

PRINT RECAPTURE indicators:
- Halftone dot patterns (regular dot grid from printing)
- Paper texture visible in the image
- Fold lines, creases, or paper edges
- Uneven lighting across a flat printed surface
- CMYK color artifacts

REAL PHOTO indicators:
- Natural depth of field (background blur)
- Natural lens distortion and vignetting
- Consistent lighting from a real light source
- Natural shadows and reflections
- Organic textures (soil, leaves, water droplets)
- No screen/print artifacts

Respond ONLY with valid JSON in this exact format:
{
  "isRecaptured": boolean,
  "confidence": number between 0.0 and 1.0,
  "source": "real_camera" | "screen" | "printout" | "uncertain",
  "artifacts": ["list of specific artifacts detected"],
  "reason": "one sentence explanation",
  "recommendation": "accept" | "warn" | "reject"
}

Rules for recommendation:
- "accept": confidence < 0.3 that it's recaptured (likely real)
- "warn": confidence between 0.3 and 0.7 (uncertain, let user retry)
- "reject": confidence > 0.7 that it's recaptured (likely fake)`;

// ── Helpers ─────────────────────────────────────────────────────────

function isUrl(input) {
  return input.startsWith("http://") || input.startsWith("https://");
}

function toBase64DataUrl(filePath) {
  const abs = path.resolve(filePath);
  if (!fs.existsSync(abs)) {
    throw new Error(`File not found: ${abs}`);
  }
  const buffer = fs.readFileSync(abs);
  const ext = path.extname(abs).toLowerCase().replace(".", "");
  const mime = ext === "jpg" ? "image/jpeg" : ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : "image/jpeg";
  return `data:${mime};base64,${buffer.toString("base64")}`;
}

// ── Main ────────────────────────────────────────────────────────────

async function detectFake(imageInput) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY environment variable is required");
  }

  const client = new OpenAI({ apiKey: OPENAI_API_KEY });

  const imageContent = isUrl(imageInput)
    ? { type: "image_url", image_url: { url: imageInput, detail: "high" } }
    : { type: "image_url", image_url: { url: toBase64DataUrl(imageInput), detail: "high" } };

  const start = Date.now();

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 500,
    temperature: 0.1,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: "Analyze this image for recapture artifacts. Is this a real camera photo or a photo of a screen/printout?" },
          imageContent,
        ],
      },
    ],
  });

  const elapsed = Date.now() - start;
  const raw = response.choices[0]?.message?.content?.trim() || "";

  // Parse JSON from response (handle markdown code blocks)
  const jsonStr = raw.replace(/^```json?\n?/, "").replace(/\n?```$/, "");
  const result = JSON.parse(jsonStr);

  return {
    ...result,
    model: MODEL,
    latencyMs: elapsed,
    tokensUsed: response.usage?.total_tokens || 0,
  };
}

// ── CLI ─────────────────────────────────────────────────────────────

const input = process.argv[2];

if (!input) {
  console.log(`
╔══════════════════════════════════════════════╗
║   🌿 Grooted — Fake Image Detection MVP     ║
╚══════════════════════════════════════════════╝

Usage:
  node detect.mjs <image-path-or-url>

Examples:
  node detect.mjs ./samples/real-plant.jpg
  node detect.mjs https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Flower_poster_2.jpg/800px-Flower_poster_2.jpg

Environment:
  OPENAI_API_KEY    Required. Your OpenAI API key.
  OPENAI_MODEL      Optional. Defaults to gpt-4o-mini.
`);
  process.exit(0);
}

console.log("\n🔍 Analyzing image...\n");

try {
  const result = await detectFake(input);

  const icon = result.recommendation === "accept" ? "✅" : result.recommendation === "warn" ? "⚠️" : "🚫";
  const label = result.recommendation === "accept" ? "REAL PHOTO" : result.recommendation === "warn" ? "UNCERTAIN" : "RECAPTURED";

  console.log(`${icon}  Result: ${label}`);
  console.log(`   Confidence: ${(result.confidence * 100).toFixed(0)}%`);
  console.log(`   Source: ${result.source}`);
  console.log(`   Reason: ${result.reason}`);
  if (result.artifacts?.length) {
    console.log(`   Artifacts: ${result.artifacts.join(", ")}`);
  }
  console.log(`   Latency: ${result.latencyMs}ms | Tokens: ${result.tokensUsed}`);
  console.log(`\n📋 Full JSON:`);
  console.log(JSON.stringify(result, null, 2));
} catch (err) {
  console.error("❌ Error:", err.message);
  process.exit(1);
}
