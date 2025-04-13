import { normalizeTagListArgument, tagRuleMatches } from "./tagRules.js";
import type {
  ISVTStyler,
  TagListArgument,
  TagRule,
  TagRuleMode,
} from "./types.js";
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
  stagsNormaliser?: (rawTags: string[]) => string[];
  vtagsNormaliser?: (rawTags: string[]) => string[];
};

export class SVTStyler implements ISVTStyler {
  readonly _rules: SVTRule[] = [];
  readonly options: SVTStylerOptions;

  constructor(rules: SVTRuleDef[], options: SVTStylerOptions = {}) {
    for (const r of rules) {
      this._rules.push(SVTStyler.normalizeRule(r));
    }
    this.options = { ...options };
  }

  with(rules: SVTRuleDef[], options: SVTStylerOptions = {}): SVTStyler {
    const addedRules: SVTRule[] = [];
    for (const r of rules) {
      addedRules.push(SVTStyler.normalizeRule(r));
    }

    const styler = new SVTStyler([], { ...this.options });
    styler._rules.push(...this._rules, ...addedRules);
    return styler;
  }

  classes(stags: TagListArgument, vtags: TagListArgument): string[] {
    const r = [] as string[];

    let stagsNormalized = normalizeTagListArgument(stags);
    let vtagsNormalized = normalizeTagListArgument(vtags);

    if (this.options.stagsNormaliser) {
      stagsNormalized = this.options.stagsNormaliser(stagsNormalized);
    }
    if (this.options.vtagsNormaliser) {
      vtagsNormalized = this.options.vtagsNormaliser(vtagsNormalized);
    }

    for (const rule of this._rules) {
      if (this.ruleMatches(rule, stagsNormalized, vtagsNormalized)) {
        r.push(...rule.classes);
      }
    }

    return this.options.normalizer ? this.options.normalizer(r) : r;
  }

  static normalizeRule(rule: SVTRuleDef): SVTRule {
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
