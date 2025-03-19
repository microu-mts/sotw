import { suite, test } from "node:test";
import assert from "node:assert/strict";
import { STagsStyler } from "../../src/mstyle";

suite("STagsStyler.ruleMatches", () => {
  const pvs = new STagsStyler([]);

  test("parts rule", () => {
    assert(
      pvs.ruleMatches(
        { tags: ["button"], lastRule: false, classes: [] },
        { tags: ["button"] }
      )
    );
    assert(
      pvs.ruleMatches(
        { tags: ["element", "button"], lastRule: false, classes: [] },
        { tags: ["button"] }
      )
    );
    assert(
      pvs.ruleMatches(
        { tags: ["button"], lastRule: false, classes: [] },
        { tags: ["element", "button"] }
      )
    );
    assert(
      !pvs.ruleMatches(
        { tags: ["checkbox"], lastRule: false, classes: [] },
        { tags: ["element", "button"] }
      )
    );
  });

  test("variant rules", () => {
    assert(
      pvs.ruleMatches(
        { variant: ["alpha", "beta"], lastRule: false, classes: [] },
        { tags: [], variant: "beta" }
      )
    );
    assert(
      pvs.ruleMatches(
        { variant: ["alpha", "beta"], lastRule: false, classes: [] },
        { tags: ["button"], variant: "alpha" }
      )
    );
    assert(
      !pvs.ruleMatches(
        { variant: ["alpha", "beta"], lastRule: false, classes: [] },
        { tags: ["button"], variant: undefined }
      )
    );
    assert(
      !pvs.ruleMatches(
        { variant: ["alpha", "beta"], lastRule: false, classes: [] },
        { tags: ["button"], variant: "gamma" }
      )
    );
  });
});

suite("STagStyler.classes", () => {
  test("Empty rule set", () => {
    const styler = new STagsStyler([]);

    assert.deepEqual(styler.classes(""), undefined);
    assert.deepEqual(styler.classes("button"), undefined);
    assert.deepEqual(styler.classes("button !A"), undefined);
    assert.deepEqual(styler.classes("button nav !A !B"), undefined);
  });

  test("Minimal rule set", () => {
    const styler = new STagsStyler([
      { tags: "button", classes: "bg-zinc-200 text-black" },
    ]);

    assert.deepEqual(styler.classes(""), undefined);
    assert.deepEqual(styler.classes("button"), ["bg-zinc-200", "text-black"]);
    assert.deepEqual(styler.classes("button !A"), [
      "bg-zinc-200",
      "text-black",
    ]);
    assert.deepEqual(styler.classes("button nav !A !B"), [
      "bg-zinc-200",
      "text-black",
    ]);
    assert.deepEqual(styler.classes("checkbox nav !A !B"), undefined);
  });
});
