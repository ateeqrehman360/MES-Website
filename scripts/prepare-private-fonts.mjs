// Build tooling only. Never import this module from application code.
import { execFile } from "node:child_process";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { promisify } from "node:util";

const run = promisify(execFile);
export const repository = "ateeqrehman360/MES-Private-Assets";
export const fontDirectory = fileURLToPath(
  new URL("../src/assets/fonts/private/", import.meta.url),
);

// Verified purchased WOFF2 files. Hashes pin the exact bytes and font identities;
// replacing a purchase requires verifying the new fonts and updating these pins.
export const fonts = [
  {
    name: "appareldisplay-regular-webfont.woff2",
    family: "Apparel Display Regular",
    size: 28400,
    sha256: "d2f0ec91914fd31d0e782906681f77ecf5877af6495c3954b0d49fb994fb20a1",
  },
  {
    name: "tan_-_headline-webfont.woff2",
    family: "TAN Headline Regular",
    size: 32632,
    sha256: "90c2e9375eef82f925d9eb05c001ce0eaf6d36dcda7bf6b0579d243f2c65aceb",
  },
];

export function validateFont(bytes, font) {
  if (
    bytes.length !== font.size ||
    bytes.toString("ascii", 0, 4) !== "wOF2" ||
    bytes.readUInt32BE(8) !== bytes.length ||
    bytes.readUInt16BE(12) === 0 ||
    bytes.readUInt16BE(14) !== 0 ||
    bytes.readUInt32BE(16) === 0 ||
    bytes.readUInt32BE(20) === 0 ||
    bytes.readUInt32BE(20) > bytes.length - 48 ||
    createHash("sha256").update(bytes).digest("hex") !== font.sha256
  ) {
    throw new Error(`${font.name}: invalid WOFF2 or unexpected contents.`);
  }
}

export function decodeFont(content, font) {
  if (
    content?.type !== "file" ||
    content.name !== font.name ||
    content.encoding !== "base64" ||
    content.size !== font.size ||
    typeof content.content !== "string"
  ) {
    throw new Error(`${font.name}: GitHub did not return the required font.`);
  }
  const bytes = Buffer.from(content.content, "base64");
  validateFont(bytes, font);
  return bytes;
}

async function downloadFont(font, token, request, cli) {
  const endpoint = `repos/${repository}/contents/${font.name}?ref=main`;
  let json;

  if (token) {
    let response;
    try {
      response = await request(`https://api.github.com/${endpoint}`, {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        redirect: "error",
        signal: AbortSignal.timeout(30_000),
      });
    } catch {
      throw new Error(`${font.name}: private GitHub request failed or timed out.`);
    }
    if (!response.ok) {
      throw new Error(
        `${font.name}: GitHub returned HTTP ${response.status}. Check MES_PRIVATE_ASSETS_TOKEN, its expiry, and Contents: Read-only access to ${repository}.`,
      );
    }
    try {
      json = await response.json();
    } catch {
      throw new Error(`${font.name}: invalid GitHub response.`);
    }
  } else {
    try {
      const { stdout } = await cli("gh", ["api", endpoint, "-H", "Accept: application/vnd.github+json"], {
        timeout: 30_000,
        maxBuffer: 256 * 1024,
        encoding: "utf8",
      });
      json = JSON.parse(stdout);
    } catch {
      // Never echo subprocess stderr, remote bodies, request headers or tokens.
      throw new Error(
        `${font.name}: authenticated GitHub CLI access failed. Run gh auth login with access to ${repository}, or set MES_PRIVATE_ASSETS_TOKEN with Contents: Read-only permission.`,
      );
    }
  }
  return decodeFont(json, font);
}

export async function prepareFonts({
  directory = fontDirectory,
  token = process.env.MES_PRIVATE_ASSETS_TOKEN,
  request = fetch,
  cli = run,
  log = console.log,
} = {}) {
  await mkdir(directory, { recursive: true });
  for (const font of fonts) {
    const destination = join(directory, font.name);
    let cached;
    try {
      cached = await readFile(destination);
    } catch (error) {
      if (error.code !== "ENOENT") throw new Error(`${font.name}: cannot read local font cache.`);
    }
    if (cached) {
      try {
        validateFont(cached, font);
      } catch {
        throw new Error(`${font.name}: invalid cached font. Delete this file from src/assets/fonts/private/ and rerun npm run fonts:prepare.`);
      }
      log(`[private fonts] Verified cached ${font.family}.`);
      continue;
    }

    const bytes = await downloadFont(font, token, request, cli);
    const temporary = `${destination}.${randomUUID()}.tmp`;
    try {
      await writeFile(temporary, bytes, { mode: 0o600, flag: "wx" });
      await rename(temporary, destination);
    } finally {
      await rm(temporary, { force: true });
    }
    log(`[private fonts] Retrieved and verified ${font.family}.`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  prepareFonts().catch((error) => {
    // All download failures are sanitized above; do not print error stacks.
    const message = error.message.startsWith(fonts[0].name) || error.message.startsWith(fonts[1].name)
      ? error.message : "Unable to prepare local fonts. Check filesystem permissions.";
    console.error(`[private fonts] ${message}`);
    process.exitCode = 1;
  });
}
