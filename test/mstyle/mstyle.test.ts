import assert from "node:assert/strict";
import { suite, test } from "node:test";
import { ISVTStyler, Stylers, TagListArgument } from "../../src/stylers";

class AStyler implements ISVTStyler {
  classes(stags: TagListArgument, vtags: TagListArgument): string[] {
    return [];
  }
}

suite("MStyle", () => {
  test("MStyle.base", () => {
    assert.notEqual(Stylers.get("default"), undefined);
    assert.strictEqual(Stylers.base, Stylers.get("default"));
    const a = new AStyler();
    const aa = new AStyler();
    Stylers.setBase(a);
    assert.strictEqual(Stylers.base, a);
    assert.notStrictEqual(Stylers.base, aa);
    Stylers.setBase(undefined);
    assert.strictEqual(Stylers.base, undefined);
  });
});
