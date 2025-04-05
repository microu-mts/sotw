import { twMerge } from "tailwind-merge";
import { ISVTStyler, TagListArgument } from "./types.js";
import { splitCleanString } from "./utils.js";

export class SVTStylerNormalizer implements ISVTStyler {
  constructor(private readonly styler: ISVTStyler) {}

  classes(stags: TagListArgument, vtags: TagListArgument): string[] {
    const r = this.styler.classes(stags, vtags);
    return r ?? [];
  }
}

export function twMergeNormalize(raw: string[]): string[] {
  return splitCleanString(twMerge(...raw));
}

export function mainTagNormalize(
  rawTags: string[],
  defaultTag?: string
): string[] {
  const rhead = [] as string[];
  const rtail = [] as string[];
  let rtag: string | undefined = undefined;
  for (const tag of rawTags) {
    if (tag.length == 1 && tag.toUpperCase() == tag) {
      rtag = tag;
      rhead.push(...rtail);
      rtail.length = 0;
    } else {
      if (rtag == undefined) {
        rhead.push(tag);
      } else {
        rtail.push(tag);
      }
    }
  }
  rtag = rtag ?? defaultTag;
  const r =
    rtag == undefined ? [...rhead, ...rtail] : [...rhead, rtag, ...rtail];
  console.log("MAIN TAGS NORM:", rawTags, r);
  return r;
}

export function exlusiveTagNormalize(
  rawTags: string[],
  tagSet: Set<String>,
  defaultTag?: string
): string[] {
  const rhead = [] as string[];
  const rtail = [] as string[];
  let rtag: string | undefined = undefined;
  for (const tag of rawTags) {
    if (tagSet.has(tag)) {
      rtag = tag;
      rhead.push(...rtail);
      rtail.length = 0;
    } else {
      if (rtag == undefined) {
        rhead.push(tag);
      } else {
        rtail.push(tag);
      }
    }
  }
  rtag = rtag ?? defaultTag;
  const r =
    rtag == undefined ? [...rhead, ...rtail] : [...rhead, rtag, ...rtail];
  console.log("EXCLU TAGS NORM:", rawTags, r);
  return r;
}
