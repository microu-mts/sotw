import { TagListArgument, TagRule } from "./types.js";
import { splitCleanString } from "./utils.js";



export function normalizeTagListArgument(arg: TagListArgument): string[] {
  if (typeof arg == "string") {
    return splitCleanString(arg);
  } else if (Array.isArray(arg)) {
    const r = [];
    for (const a of arg) {
      r.push(...normalizeTagListArgument(a));
    }
    return r;
  }
  return [];
}


export function tagRuleMatches(
  rule:TagRule,
  candidateTags: string[]
) {
  if (rule.mode == "any") {
    return true;
  } else if (rule.mode == "or") {
    for (const ctag of candidateTags) {
      if (rule.tags.indexOf(ctag) >= 0) {
        return true;
      }
    }
    return false;
  } else if (rule.mode == "and") {
    for (const rtag of rule.tags) {
      if (candidateTags.indexOf(rtag) < 0) {
        return false;
      }
    }
    return true;
  }
  return false;
}
