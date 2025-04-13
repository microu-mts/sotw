import { suite, test } from "node:test";
import assert from "node:assert/strict";
import { SVTRuleDef, SVTStyler } from "../../src/stylers/index.js";
import { deduplicate } from "../../src/stylers/utils.js";

function createRandomString(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

suite("SVTStyler.ruleMatches", () => {
  const styler = new SVTStyler([]);

  test("stag rules", () => {
    const orRule = SVTStyler.normalizeRule({ stags: ["A", "B"] });
    assert(styler.ruleMatches(orRule, ["A"], []));
    assert(styler.ruleMatches(orRule, ["B"], ["alpha", "beta"]));
    assert(styler.ruleMatches(orRule, ["A", "C"], ["alpha", "beta"]));
    assert(styler.ruleMatches(orRule, ["B", "Z", "A"], ["alpha", "beta"]));
    assert(!styler.ruleMatches(orRule, ["C"], ["alpha", "beta"]));

    const andRule = SVTStyler.normalizeRule({
      stagMode: "and",
      stags: ["A", "B"],
    });
    assert(!styler.ruleMatches(andRule, ["A"], []));
    assert(!styler.ruleMatches(andRule, ["B"], ["alpha", "beta"]));
    assert(styler.ruleMatches(andRule, ["A", "C", "B"], ["alpha", "beta"]));
    assert(styler.ruleMatches(andRule, ["B", "Z", "A"], ["alpha", "beta"]));
    assert(!styler.ruleMatches(andRule, ["C"], ["alpha", "beta"]));
  });

  test("vtag rules", () => {
    const orRule = SVTStyler.normalizeRule({ vtags: ["alpha", "beta"] });
    assert(styler.ruleMatches(orRule, [], ["alpha"]));
    assert(styler.ruleMatches(orRule, ["A"], ["alpha"]));
    assert(styler.ruleMatches(orRule, ["A", "C"], ["alpha", "gamma", "beta"]));
    assert(styler.ruleMatches(orRule, ["B", "Z", "A"], ["beta", "gamma"]));
    assert(!styler.ruleMatches(orRule, ["C"], ["delta", "omega"]));

    const andRule = SVTStyler.normalizeRule({
      vtagMode: "and",
      vtags: ["alpha", "beta"],
    });
    assert(!styler.ruleMatches(andRule, [], ["alpha"]));
    assert(styler.ruleMatches(andRule, ["A"], ["alpha", "beta"]));
    assert(styler.ruleMatches(andRule, ["A", "C"], ["alpha", "gamma", "beta"]));
    assert(!styler.ruleMatches(andRule, ["B", "Z", "A"], ["beta", "gamma"]));
    assert(!styler.ruleMatches(andRule, ["C"], ["delta", "omega"]));
  });

  test("stag+vtag rules", () => {
    const orRule = SVTStyler.normalizeRule({
      stags: ["A", "B"],
      vtags: ["alpha", "beta"],
    });
    assert(!styler.ruleMatches(orRule, [], ["alpha"]));
    assert(styler.ruleMatches(orRule, ["A"], ["alpha"]));
    assert(styler.ruleMatches(orRule, ["A", "C"], ["alpha", "gamma", "beta"]));
    assert(!styler.ruleMatches(orRule, ["Z"], ["gamma", "omega"]));
    assert(!styler.ruleMatches(orRule, ["C"], ["delta", "omega"]));

    const andRule = SVTStyler.normalizeRule({
      stagMode: "and",
      stags: ["A", "B"],
      vtagMode: "and",
      vtags: ["alpha", "beta"],
    });
    assert(!styler.ruleMatches(andRule, ["A"], ["alpha"]));
    assert(styler.ruleMatches(andRule, ["B", "A"], ["alpha", "beta"]));
    assert(
      styler.ruleMatches(andRule, ["A", "C", "B"], ["beta", "gamma", "alpha"])
    );
    assert(!styler.ruleMatches(andRule, ["Z"], ["gamma", "omega"]));
    assert(!styler.ruleMatches(andRule, ["C"], ["delta", "omega"]));
  });

  test("any rules", () => {
    const anyRule = SVTStyler.normalizeRule({});
    console.log("ANYRULE:", anyRule);
    assert(styler.ruleMatches(anyRule, [], []));

    for (let i = 0; i < 1000; i += 1) {
      const stags = [createRandomString(5), createRandomString(8)];
      const vtags = [createRandomString(4), createRandomString(6)];
      assert(styler.ruleMatches(anyRule, stags, []), `${stags}, []`);
      assert(styler.ruleMatches(anyRule, [], vtags), `[], ${vtags}`);
      assert(styler.ruleMatches(anyRule, stags, vtags), `${stags}, ${vtags}`);
    }
  });
});

suite("SVTStyler.classes", () => {
  const rulesA: SVTRuleDef[] = [
    { stags: ["A"], classes: ["a"] },
    { stags: ["B"], classes: ["b"] },
    { stags: ["C"], classes: ["c"] },
    { stags: ["SA"], classes: ["a"] },
    { stags: ["SB"], classes: ["b"] },
    { stags: ["SC"], classes: ["c"] },
    { vtags: ["one"], classes: "v v-one" },
    { vtags: ["two"], classes: "v v-two" },
    { vtags: ["three"], classes: "v v-three" },
  ];

  const stylerA = new SVTStyler(rulesA);
  const stylerADeduplicate = new SVTStyler(rulesA, { normalizer: deduplicate });

  test("stylerA", () => {
    assert.deepEqual(stylerA.classes("A", ""), ["a"]);
    assert.deepEqual(stylerA.classes("C A B", ""), ["a", "b", "c"]);
    assert.deepEqual(stylerA.classes("C B", "two"), ["b", "c", "v", "v-two"]);

    assert.deepEqual(stylerA.classes("A B C SA SB", ""), [
      "a",
      "b",
      "c",
      "a",
      "b",
    ]);
    assert.deepEqual(stylerADeduplicate.classes("A B C SA SB", ""), [
      "a",
      "b",
      "c",
    ]);
  });
});
