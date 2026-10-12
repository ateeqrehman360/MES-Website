import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import test from "node:test";
import ts from "typescript";

const require = createRequire(import.meta.url);
const sourceRoot = new URL("../src/", import.meta.url);

function renderer() {
  const calls = [];
  const loadedFonts = [];
  const context = new Proxy({
    measureText: () => ({ width: 16, fontBoundingBoxAscent: 12, fontBoundingBoxDescent: 4 }),
  }, {
    get: (target, key) => key in target ? target[key] : (...args) => calls.push([key, ...args]),
  });
  const canvas = { width: 0, height: 0, getContext: () => context };
  const cache = new Map();
  const globals = {
    document: {
      createElement: () => canvas,
      documentElement: {},
      fonts: { load: async (spec) => { loadedFonts.push(spec); return [{}]; } },
    },
    window: { innerWidth: 390, innerHeight: 844 },
    FontFace: class {},
    getComputedStyle: () => ({
      getPropertyValue: (name) => ({
        "--font-hero-apparel": "Apparel",
        "--font-hero-hanken": "Hanken",
      })[name] || "",
    }),
  };
  function load(relative) {
    if (cache.has(relative)) return cache.get(relative);
    const path = fileURLToPath(new URL(relative, sourceRoot));
    const code = ts.transpileModule(readFileSync(path, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const exports = {};
    const localRequire = (name) => {
      if (name === "@/data/hero") return load("data/hero.ts");
      if (name === "./hero-purpose-layout") return load("components/hero/hero-purpose-layout.ts");
      return require(name);
    };
    vm.runInNewContext(code, { ...globals, exports, require: localRequire }, { filename: path });
    cache.set(relative, exports);
    return exports;
  }
  return { ...load("components/hero/hero-display-texture.ts"), calls, loadedFonts, canvas };
}

test("opening artwork is an image at the existing texture resolution, with only purpose fonts loaded", async () => {
  const r = renderer();
  const logo = { id: "logo" };
  const artwork = { id: "opening" };
  const display = r.createHeroDisplayTexture(logo, artwork, true, 1.5);
  assert.equal(r.canvas.width, 1869);
  assert.equal(r.canvas.height, 1080);
  assert.ok(r.calls.some(([name, image]) => name === "drawImage" && image === artwork));
  assert.ok(!r.calls.some(([name]) => name === "fillText"));
  await display.fontsReady;
  assert.deepEqual(r.loadedFonts, ["400 16px Apparel", "400 16px Hanken"]);
  display.texture.dispose();
});

test("readiness waits for the next upload even when a previous frame was uploaded", () => {
  const r = renderer();
  const display = r.createHeroDisplayTexture({}, {}, false);
  display.texture.onUpdate();
  let reports = 0;
  const unsubscribe = display.onNextUpload(() => reports++);
  assert.equal(reports, 0);
  display.draw(0);
  display.texture.onUpdate();
  assert.equal(reports, 1);
  display.texture.onUpdate();
  assert.equal(reports, 1);
  unsubscribe();
  display.onNextUpload(() => reports++)();
  display.texture.onUpdate();
  assert.equal(reports, 1);
  display.texture.dispose();
});

test("all three photo reveals and the live purpose statement survive forward and reverse drawing", async () => {
  const r = renderer();
  const artwork = { id: "opening" };
  const logo = { id: "logo" };
  const photos = [0, 1, 2].map((id) => ({ id, naturalWidth: 1600, naturalHeight: 1000 }));
  const display = r.createHeroDisplayTexture(logo, artwork, true, 1.5);
  photos.forEach((image, index) => display.setPhotograph(index, image));
  await display.fontsReady;
  const sequence = [0, .3, .475, .61, .67, .75, .84];
  for (const progress of [...sequence, ...sequence.toReversed()]) {
    r.calls.length = 0;
    display.draw(progress);
    const images = r.calls.filter(([name]) => name === "drawImage").map(([, image]) => image);
    if (progress === 0) assert.ok(images.includes(artwork));
    if (progress === .3) assert.ok(images.includes(artwork) && images.includes(photos[0]));
    if (progress === .475) assert.ok(images.includes(photos[0]) && images.includes(photos[1]));
    if (progress === .61) assert.ok(images.includes(photos[1]) && images.includes(photos[2]));
    if ([.3, .475, .61].includes(progress)) assert.ok(r.calls.some(([name]) => name === "clip"));
    if (progress === .67) assert.ok(images.includes(photos[2]) && images.includes(logo));
    if (progress >= .75) assert.ok(r.calls.some(([name]) => name === "fillText"));
  }
  display.texture.dispose();
});

test("unchanged opening and mobile Bazaar artwork still avoid redundant texture uploads", () => {
  const { getHeroDisplayDrawProgress: drawProgress } = renderer();
  assert.equal(drawProgress(.274, true, true), 0);
  assert.equal(drawProgress(.66, true, true), .645);
  assert.equal(drawProgress(.7, true, true), .645);
  assert.equal(drawProgress(.81, false), .79);
  assert.equal(drawProgress(1, true, true), 1);
});
