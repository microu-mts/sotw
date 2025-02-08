import { suite, test } from "node:test";
import assert from "node:assert/strict";
import { splitCleanString } from "../../src/mstyle/utils.js";

suite("splitCleanString", () => {
  test("default options", () => {
    assert.deepEqual(splitCleanString("AAA BBB CCC"), ["AAA", "BBB", "CCC"]);
    assert.deepEqual(splitCleanString(" AAA   BBB CCC  "), [
      "AAA",
      "BBB",
      "CCC",
    ]);
    assert.deepEqual(splitCleanString("AAA   BBB CCC   "), [
      "AAA",
      "BBB",
      "CCC",
    ]);
    assert.deepEqual(splitCleanString("   AAA BBB         CCC"), [
      "AAA",
      "BBB",
      "CCC",
    ]);
  });

  test("options separator dot", () => {
    assert.deepEqual(splitCleanString("AAA.BBB.CCC", { separator: "." }), [
      "AAA",
      "BBB",
      "CCC",
    ]);
    assert.deepEqual(splitCleanString(".AAA....BBB.CCC.", { separator: "." }), [
      "AAA",
      "BBB",
      "CCC",
    ]);
  });

  test("options filter any", () => {
    assert.deepEqual(splitCleanString("AAA BBB CCC", { filter: (s) => true }), [
      "AAA",
      "BBB",
      "CCC",
    ]);
    assert.deepEqual(
      splitCleanString("AAA    BBB   CCC", { filter: (s) => true }),
      ["AAA", "BBB", "CCC"]
    );
    assert.deepEqual(
      splitCleanString("   AAA    BBB   CCC  ", { filter: (s) => true }),
      ["", "AAA", "BBB", "CCC", ""]
    );
    assert.deepEqual(
      splitCleanString(" AAA  BBB CCC  ", {
        separator: " ",
        filter: (s) => true,
      }),
      ["", "AAA", "", "BBB", "CCC", "", ""]
    );
  });
  test("options filter out ?+ separator :+", () => {
    assert.deepEqual(
      splitCleanString("??:AAA:???:BBB::::CCC:?", {
        separator: /\:+/,
        filter: (s: string) => !s.match(/^\?+$/)
      }),
      ["AAA", "BBB", "CCC"]
    );
  });
});
