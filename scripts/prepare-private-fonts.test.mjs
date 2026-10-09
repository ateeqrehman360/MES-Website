import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import { decodeFont, fontDirectory, fonts, prepareFonts, validateFont } from "./prepare-private-fonts.mjs";

// Fixtures stay in the ignored cache; no purchased font enters Git.
const bytes = await Promise.all(fonts.map((font) => readFile(join(fontDirectory, font.name))));
const payload = (font, data) => ({
  type: "file", name: font.name, encoding: "base64", size: font.size,
  content: data.toString("base64"),
});
const offline = () => { throw new Error("Network must not be used for valid cache."); };

async function inTemporaryDirectory(callback) {
  const directory = await mkdtemp(join(tmpdir(), "mes-fonts-test-"));
  try { await callback(directory); }
  finally { await rm(directory, { recursive: true, force: true }); }
}

test("verified WOFF2 bytes survive JSON decoding unchanged", () => {
  fonts.forEach((font, i) => {
    validateFont(bytes[i], font);
    assert.deepEqual(decodeFont(payload(font, bytes[i]), font), bytes[i]);
  });
});

test("rejects truncated, corrupt and wrong-family files", () => {
  assert.throws(() => validateFont(Buffer.alloc(0), fonts[0]), /invalid WOFF2/);
  assert.throws(() => validateFont(bytes[0].subarray(0, -1), fonts[0]), /invalid WOFF2/);
  const changed = Buffer.from(bytes[0]); changed[changed.length - 1] ^= 1;
  assert.throws(() => validateFont(changed, fonts[0]), /invalid WOFF2/);
  assert.throws(() => validateFont(bytes[1], fonts[0]), /invalid WOFF2/);
  assert.throws(() => decodeFont({ ...payload(fonts[0], bytes[0]), encoding: "utf8" }, fonts[0]), /required font/);
});

test("token path authenticates in headers and atomically saves exact bytes", async () => {
  await inTemporaryDirectory(async (directory) => {
    const logs = []; const calls = [];
    const token = "test-secret-never-log";
    await prepareFonts({directory, token, cli: offline, log: (line) => logs.push(line),
      request: async (url, options) => {
        assert.ok(url.startsWith("https://api.github.com/repos/ateeqrehman360/MES-Private-Assets/contents/"));
        assert.ok(url.endsWith("?ref=main")); assert.ok(!url.includes(token));
        assert.equal(options.headers.Authorization, `Bearer ${token}`);
        assert.equal(options.redirect, "error"); assert.ok(options.signal);
        const i = calls.length; calls.push(url);
        return { ok: true, json: async () => payload(fonts[i], bytes[i]) };
      },
    });
    assert.equal(calls.length, 2);
    assert.ok(!logs.join("\n").includes(token));
    for (const [i, font] of fonts.entries()) assert.deepEqual(await readFile(join(directory, font.name)), bytes[i]);
    await prepareFonts({ directory, token, request: offline, cli: offline, log: () => {} });
  });
});

test("local GitHub CLI path uses authenticated JSON contents requests", async () => {
  await inTemporaryDirectory(async (directory) => {
    let calls = 0;
    await prepareFonts({directory, token: "", request: offline, log: () => {},
      cli: async (command, args, options) => {
        assert.equal(command, "gh"); assert.equal(args[0], "api");
        assert.ok(args[1].includes(fonts[calls].name)); assert.equal(options.timeout, 30000);
        return { stdout: JSON.stringify(payload(fonts[calls], bytes[calls++])) };
      },
    });
    assert.equal(calls, 2);
  });
});

test("invalid cache fails before network access", async () => {
  await inTemporaryDirectory(async (directory) => {
    await writeFile(join(directory, fonts[0].name), "bad-cache");
    await assert.rejects(prepareFonts({directory, request: offline, cli: offline, log: () => {}}), /invalid cached font/);
  });
});

test("authentication, network and CLI failures never echo credentials or remote bodies", async () => {
  for (const request of [
    async () => ({ ok: false, status: 404, json: async () => { throw new Error("secret-remote-body"); } }),
    async () => { throw new Error("secret-request-header"); },
    async () => ({ ok: true, json: async () => { throw new Error("secret-response"); } }),
  ]) {
    await inTemporaryDirectory(async (directory) => {
      await assert.rejects(prepareFonts({directory, token: "secret-token", request, log: () => {}}),
        (error) => !/secret-/.test(error.message) && /GitHub/.test(error.message));
      await assert.rejects(readFile(join(directory, fonts[0].name)), {code:"ENOENT"});
    });
  }
  await inTemporaryDirectory(async (directory) => {
    await assert.rejects(prepareFonts({directory, token: "", log: () => {}, cli: async () => { throw new Error("secret-cli-stderr"); }}),
      (error) => /authenticated GitHub CLI/.test(error.message) && !error.message.includes("secret"));
  });
});
