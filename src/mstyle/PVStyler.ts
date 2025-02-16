import { fchmodSync } from "fs";
import { MStyler } from "./types";
import { ensureSplittedString } from "./utils";

export type PVStylerRule = {
  part?: string | string[];
  variant?: string | string[];
  matcher?: (apart: AnalyzedParts) => boolean;
  classes: string[];
  lastRule?: boolean;
};

type PVStylerRuleCompiled = {
  part?: string[];
  variant?: string[];
  matcher?: (apart: AnalyzedParts) => boolean;
  classes: string[];
  lastRule: boolean;
};

type AnalyzedParts = {
  parts: string[];
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

export class PVStyler implements MStyler {
  private rules: PVStylerRuleCompiled[] = [];

  constructor(rules: PVStylerRule[]) {
    for (const r of rules) {
      this.rules.push(this.compileRule(r));
    }
  }

  compileRule(rule: PVStylerRule): PVStylerRuleCompiled {
    const part = compileStringArray(rule.part);
    const variant = compileStringArray(rule.variant);
    const matcher = rule.matcher;
    const classes = [...rule.classes];
    const lastRule = !!rule.lastRule;

    return { part, variant, matcher, classes, lastRule };
  }

  classes(parts: string | string[]): string[] {
    const aparts = this.analyzeParts(ensureSplittedString(parts));

    return [];
  }

  analyzeParts(rawParts: string[]): AnalyzedParts {
    let variant = undefined;
    const parts = [] as string[];
    for (const p of rawParts) {
      if (p.startsWith("!")) {
        variant = p.slice(1);
      } else {
        parts.push(p);
      }
    }
    return { parts, variant };
  }

  ruleMatches(rule: PVStylerRuleCompiled, apart: AnalyzedParts): boolean {
    if (rule.part != undefined) {
      let found = false;
      for (const p of apart.parts) {
        const i = rule.part.indexOf(p);
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
