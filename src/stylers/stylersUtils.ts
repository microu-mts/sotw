import { ISVTStyler, TagListArgument } from "./types";

export class SVTStylerNormalizer implements ISVTStyler {
  constructor(private readonly styler: ISVTStyler) {}

  classes(stags: TagListArgument, vtags: TagListArgument): string[] {
    const r = this.styler.classes(stags, vtags);
    return r ?? [];
  }
}
