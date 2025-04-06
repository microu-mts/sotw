
export type TagListArgument = string | string[] | TagListArgument[] | undefined;

export type TagRuleMode = "or" | "and" | "any";
export type TagRule = { mode: TagRuleMode; tags: string[] };

export interface ISVTStyler {
  classes(stags: TagListArgument, vtags: TagListArgument): string[]| undefined;
}

