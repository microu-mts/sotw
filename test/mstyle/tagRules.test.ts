import { suite, test } from "node:test";
import assert from "node:assert/strict";
import {
  normalizeTagListArgument,
  TagRule,
  tagRuleMatches,
} from "../../src/mstyle/tagRules.js";

suite("normalizeTagListArgument", () => {
  test("normalizeTagListArgument(undefined)", () => {
    assert.deepEqual(normalizeTagListArgument(undefined), []);
  });

  test("normalizeTagListArgument(one tag string)", () => {
    assert.deepEqual(normalizeTagListArgument("alpha"), ["alpha"]);
  });
  test("normalizeTagListArgument(dirty one tag string)", () => {
    assert.deepEqual(normalizeTagListArgument("  alpha "), ["alpha"]);
  });

  test("normalizeTagListArgument(multiple tags string)", () => {
    assert.deepEqual(normalizeTagListArgument("alpha beta gamma"), [
      "alpha",
      "beta",
      "gamma",
    ]);
  });
  test("normalizeTagListArgument(dirty multiple tags string)", () => {
    assert.deepEqual(normalizeTagListArgument("  alpha beta  gamma "), [
      "alpha",
      "beta",
      "gamma",
    ]);
  });

  test("normalizeTagListArgument(nested tags)", () => {
    assert.deepEqual(
      normalizeTagListArgument([
        "alpha",
        [undefined, "beta  gamma"],
        undefined,
      ]),
      ["alpha", "beta", "gamma"]
    );
  });
  test("flattenSplitArg(more nested tags)", () => {
    assert.deepEqual(
      normalizeTagListArgument([
        [],
        "alpha",
        [[undefined, "beta  gamma"], undefined, [["delta"]]],
        undefined,
      ]),
      ["alpha", "beta", "gamma", "delta"]
    );
  });
});

suite("tagRuleMatches", () => {
  const anyRule: TagRule = {
    mode: "any",
    tags: [],
  };
  const anyRuleWithTags: TagRule = {
    mode: "any",
    tags: ["one", "two", "three"],
  };

  test("tagRuleMatches mode=any", () => {
    assert(tagRuleMatches(anyRule, []));
  });

  test("tagRuleMatches mode=or", () => {
    const orRule: TagRule = { mode: "or", tags: ["un", "deux", "trois"] };

    assert(tagRuleMatches(orRule, ["un"]));
    assert(tagRuleMatches(orRule, ["deux"]));
    assert(tagRuleMatches(orRule, ["trois"]));
    assert(tagRuleMatches(orRule, ["deux", "un"]));
    assert(tagRuleMatches(orRule, ["trois", "deux", "un"]));

    assert(!tagRuleMatches(orRule, []));
    assert(!tagRuleMatches(orRule, ["one"]));
    assert(!tagRuleMatches(orRule, ["one", "two", "three"]));

    assert(tagRuleMatches(orRule, ["one", "two", "deux", "three"]));
  });

  test("tagRuleMatches mode=or no tags => always false", () => {
    const orRule: TagRule = { mode: "or", tags: [] };
    assert(!tagRuleMatches(orRule, []));
    assert(!tagRuleMatches(orRule, ["un", "deux"]));
  });
  test("tagRuleMatches mode=ansno tags => always true", () => {
    const andRule: TagRule = { mode: "and", tags: [] };
    assert(tagRuleMatches(andRule, []));
    assert(tagRuleMatches(andRule, ["un", "deux"]));

  });

  test("tagRuleMatches mode=and", () => {
    const andRule: TagRule = { mode: "and", tags: ["un", "deux", "trois"] };

    assert(!tagRuleMatches(andRule, ["un"]));
    assert(!tagRuleMatches(andRule, ["deux"]));
    assert(!tagRuleMatches(andRule, ["trois"]));
    assert(!tagRuleMatches(andRule, ["one", "un", "trois"]));
    assert(tagRuleMatches(andRule, ["trois", "deux", "un"]));
    assert(
      tagRuleMatches(andRule, ["one", "trois", "two", "deux", "three", "un"])
    );
    assert(!tagRuleMatches(andRule, []));
  });
});
