import { MStyler } from "./types";

export class MStylerChain implements MStyler {
  readonly stylers: MStyler[];

  constructor(stylers: MStyler[]) {
    this.stylers = [...stylers];
  }
  classes(parts: string | string[]): string[] | undefined {
    for (const sty of this.stylers) {
      const r = sty.classes(parts);
      if (r != undefined) {
        return r;
      }
    }
    return undefined;
  }
}

export class MStylerStack implements MStyler {
  readonly stylers: MStyler[];

  constructor(stylers: MStyler[]) {
    this.stylers = [...stylers];
  }

  classes(parts: string | string[]): string[] | undefined {
    let matchCount = 0;
    const rc = [] as string[];
    for (const sty of this.stylers) {
      const r = sty.classes(parts);
      if (r != undefined) {
        matchCount += 1;
        rc.push(...r);
      }
    }
    return matchCount != 0 ? rc : undefined;
  }
}

export class MStylerNormalizer implements MStyler {
  constructor(readonly styler: MStyler) {}

  classes(parts: string | string[]): string[] | undefined {
    const r = this.styler.classes(parts);
    return r == undefined ? [] : r;
  }
}
