import { suite, test } from "node:test";
import assert from "node:assert/strict";
import { normalizeTagListArgument } from "../../src/stylers/tagRules.js";
import { deduplicate, splitCleanString } from "../../src/stylers/utils.js";

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
        filter: (s: string) => !s.match(/^\?+$/),
      }),
      ["AAA", "BBB", "CCC"]
    );
  });
});

suite("deduplicate", () => {
  test("deduplicate empty list", () => {
    assert.deepEqual(deduplicate([]), []);
  });

  test("deduplicate list without duplicates", () => {
    assert.deepEqual(deduplicate([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5]);
  });

  test("deduplicate list with duplicates", () => {
    assert.deepEqual(
      deduplicate([1, 1, 1, 11, 2, 22, 1, 2, 3, 11, 4, 3, 2, 1, 22, 5, 11]),
      [1, 11, 2, 22, 3, 4, 5]
    );
  });
});
