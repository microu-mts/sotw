import { twMerge } from "tailwind-merge";
import { MStyler } from "./types";
import { normalizeTagListArgument } from "./tagRules";

export type STagsStylerRule = {
  tags?: string | string[];
  variant?: string | string[];
  matcher?: (apart: AnalyzedTags) => boolean;
  classes: string | string[];
  lastRule?: boolean;
};

type STagsStylerRuleCompiled = {
  tags?: string[];
  variant?: string[];
  matcher?: (apart: AnalyzedTags) => boolean;
  classes: string[];
  lastRule: boolean;
};

type AnalyzedTags = {
  tags: string[];
  variant?: string;
};

function compileStringArray(arg: undefined): undefined;
function compileStringArray(arg: string): string[];
function compileStringArray(arg: string[]): string[];
function compileStringArray(
  arg: string | string[] | undefined
): string[] | undefined;
function compileStringArray(
  arg: string | string[] | undefined
): string[] | undefined {
  if (typeof arg == "string") {
    return [arg];
  }

  if (Array.isArray(arg)) {
    return [...arg];
  }

  return arg;
}

export class STagsStyler implements MStyler {
  private rules: STagsStylerRuleCompiled[] = [];

  constructor(rules: STagsStylerRule[]) {
    for (const r of rules) {
      this.rules.push(this.compileRule(r));
    }
  }

  compileRule(rule: STagsStylerRule): STagsStylerRuleCompiled {
    const tags = compileStringArray(rule.tags);
    const variant = compileStringArray(rule.variant);
    const matcher = rule.matcher;
    const classes = [...compileStringArray(rule.classes)!];
    const lastRule = !!rule.lastRule;

    return { tags: tags, variant, matcher, classes, lastRule };
  }

  classes(parts: string | string[]): string[] | undefined {
    const aparts = this.analyzeParts(normalizeTagListArgument(parts));
    console.log("APART:", parts, aparts)

    const r: string[] = [];
    let matchCount = 0;
    for (const rule of this.rules) {
      if (this.ruleMatches(rule, aparts)) {
        matchCount += 1;
        r.push(...rule.classes);
        if (rule.lastRule) {
          break;
        }
      }
    }

    return matchCount == 0 ? undefined : normalizeTagListArgument(twMerge(r));
  }

  analyzeParts(rawParts: string[]): AnalyzedTags {
    let variant = undefined;
    const parts = [] as string[];
    for (const p of rawParts) {
      if (p.startsWith("!")) {
        variant = p.slice(1);
      } else {
        parts.push(p);
      }
    }
    return { tags: parts, variant };
  }

  ruleMatches(rule: STagsStylerRuleCompiled, apart: AnalyzedTags): boolean {
    if (rule.tags != undefined) {
      let found = false;
      for (const p of apart.tags) {
        const i = rule.tags.indexOf(p);
        if (i >= 0) {
          found = true;
        }
      }
      if (!found) {
        return false;
      }
    }

    if (rule.variant != undefined) {
      if (
        apart.variant == undefined ||
        rule.variant.indexOf(apart.variant) < 0
      ) {
        return false;
      }
    }

    if (rule.matcher != undefined) {
      if (!rule.matcher(apart)) {
        return false;
      }
    }

    return true;
  }
}
