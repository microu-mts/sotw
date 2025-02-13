import { suite, test } from "node:test";
import assert from "node:assert/strict";
import { PVStyler } from "../../src/mstyle";

suite("PVStyler.ruleMatches", () => {
  const pvs = new PVStyler([]);

  test("parts rule", () => {
    assert(
      pvs.ruleMatches(
        { part: ["button"], lastRule: false, classes: [] },
        { parts: ["button"] }
      )
    );
    assert(
      pvs.ruleMatches(
        { part: ["element", "button"], lastRule: false, classes: [] },
        { parts: ["button"] }
      )
    );
    assert(
      pvs.ruleMatches(
        { part: ["button"], lastRule: false, classes: [] },
        { parts: ["element", "button"] }
      )
    );
    assert(
      !pvs.ruleMatches(
        { part: ["checkbox"], lastRule: false, classes: [] },
        { parts: ["element", "button"] }
      )
    );
  });

  test("variant rules", () => {
    assert(
      pvs.ruleMatches(
        { variant: ["alpha", "beta"], lastRule: false, classes: [] },
        { parts: [], variant: "beta" }
      )
    );
    assert(
      pvs.ruleMatches(
        { variant: ["alpha", "beta"], lastRule: false, classes: [] },
        { parts: ["button"], variant: "alpha" }
      )
    );
    assert(
      !pvs.ruleMatches(
        { variant: ["alpha", "beta"], lastRule: false, classes: [] },
        { parts: ["button"], variant: undefined }
      )
    );
    assert(
      !pvs.ruleMatches(
        { variant: ["alpha", "beta"], lastRule: false, classes: [] },
        { parts: ["button"], variant: "gamma" }
      )
    );
  });
});
