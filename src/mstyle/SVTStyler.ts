import { randomInt } from "crypto";
import { TagRule, tagRuleMatches, TagRuleMode } from "./tagRules.js";
import { normalizeTagListArgument, TagListArgument } from "./tagRules.js";
import { deduplicate } from "./utils.js";

export type SVTRule = {
  stagRule: TagRule;
  vtagRule: TagRule;
  classes: string[];
};

export type SVTRuleDef = {
  stagMode?: TagRuleMode;
  vtagMode?: TagRuleMode;
  stags?: TagListArgument;
  vtags?: TagListArgument;
  classes?: TagListArgument;
};

type SVTStylerOptions = {
  normalizer?: (rawClasses: string[]) => string[];
};

export interface ISVTStyler {
  classes(stags: TagListArgument, vtags: TagListArgument): string[];

}


export class SVTStyler implements ISVTStyler{
  readonly _rules: SVTRule[] = [];
  readonly options: { normalizer?: (rawClasses: string[]) => string[] };

  constructor(rules: SVTRuleDef[], options: SVTStylerOptions = {}) {
    for (const r of rules) {
      this._rules.push(this.normalizeRule(r));
    }
    this.options = { ...options };
  }

  classes(stags: TagListArgument, vtags: TagListArgument): string[] {
    const r = [] as string[];
    const stagsNormalized = normalizeTagListArgument(stags);
    const vtagsNormalized = normalizeTagListArgument(vtags);

    for (const rule of this._rules) {
      if (this.ruleMatches(rule, stagsNormalized, vtagsNormalized)) {
        r.push(...rule.classes);
      }
    }

    return this.options.normalizer ? this.options.normalizer(r) : r;
  }

  normalizeRule(rule: SVTRuleDef): SVTRule {
    let stagMode: TagRuleMode = rule.stagMode ?? "or";
    let vtagMode: TagRuleMode = rule.vtagMode ?? "or";
    let stags: string[] = deduplicate(normalizeTagListArgument(rule.stags));
    let vtags: string[] = deduplicate(normalizeTagListArgument(rule.vtags));
    let classes: string[] = deduplicate(normalizeTagListArgument(rule.classes));

    if (rule.stags == undefined && rule.stagMode == undefined) {
      stagMode = "any";
    }
    if (rule.vtags == undefined && rule.vtagMode == undefined) {
      vtagMode = "any";
    }

    return {
      stagRule: { mode: stagMode, tags: stags },
      vtagRule: { mode: vtagMode, tags: vtags },
      classes,
    };
  }

  ruleMatches(rule: SVTRule, stags: string[], vtags: string[]) {
    return (
      tagRuleMatches(rule.stagRule, stags) &&
      tagRuleMatches(rule.vtagRule, vtags)
    );
  }
}
