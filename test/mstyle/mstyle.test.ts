import { suite, test } from "node:test";
import assert from "node:assert/strict";
import { MStyle } from "../../src/mstyle";
import { MStyler } from "../../src/mstyle/types";

class AStyler implements MStyler {
  classes(parts: string | string[]): string[] {
    throw new Error("Method not implemented.");
  }
}

suite("MStyle", () => {
  test("MStyle.base", () => {
    assert.strictEqual(MStyle.base, undefined);
    const a = new AStyler();
    const aa = new AStyler();
    MStyle.setBase(a);
    assert.strictEqual(MStyle.base, a);
    assert.notStrictEqual(MStyle.base, aa);
    MStyle.setBase();
  });

  test("MStyle.base bis", () => {
    assert.strictEqual(MStyle.base, undefined);
    const a = new AStyler();
    const aa = new AStyler();
    MStyle.setBase(a);
    assert.strictEqual(MStyle.base, a);
    assert.notStrictEqual(MStyle.base, aa);
  });
});
