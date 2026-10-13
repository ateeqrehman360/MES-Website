import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";

const code = ts.transpileModule(
  readFileSync(new URL("../src/lib/committee-recruitment.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;
const exports = {};
vm.runInNewContext(code, { exports, Intl, Date });
const { isRecruitmentOpen, isRecruitmentPage } = exports;

test("invitation is limited to the two eligible routes", () => {
  assert.equal(isRecruitmentPage("/"), true);
  assert.equal(isRecruitmentPage("/work-with-us"), true);
  for (const path of ["/about", "/events", "/privacy", "/work-with-us/other", "/unknown"]) {
    assert.equal(isRecruitmentPage(path), false, path);
  }
});

test("applications remain open through 27 October London time and expire at midnight", () => {
  for (const instant of ["2026-10-13T12:00:00Z", "2026-10-27T00:00:00Z", "2026-10-27T23:59:59.999Z"]) {
    assert.equal(isRecruitmentOpen(new Date(instant)), true, instant);
  }
  for (const instant of ["2026-10-28T00:00:00Z", "2026-10-28T12:00:00Z", "2027-01-01T00:00:00Z"]) {
    assert.equal(isRecruitmentOpen(new Date(instant)), false, instant);
  }
});

test("London calendar handling is independent of visitor timezone, including the DST change", () => {
  assert.equal(isRecruitmentOpen(new Date("2026-10-24T23:30:00Z")), true);
  assert.equal(isRecruitmentOpen(new Date("2026-10-25T01:30:00Z")), true);
  assert.equal(isRecruitmentOpen(new Date("2026-10-28T08:59:59.999+09:00")), true);
  assert.equal(isRecruitmentOpen(new Date("2026-10-27T17:00:00-07:00")), false);
});
