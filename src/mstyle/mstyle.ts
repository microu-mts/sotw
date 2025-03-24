import { ISVTStyler } from "./SVTStyler";
import { MStyler } from "./types";

export class MStyle {
  private static _base?: MStyler;
  private static _svtStyler: ISVTStyler;
  static get base(): MStyler | undefined {
    return MStyle._base;
  }
  static setBase(styler?: MStyler) {
    MStyle._base = styler;
  }

  static setSVTStyler(styler: ISVTStyler) {
    MStyle._svtStyler = styler;
  }

  static get svtStyler(): ISVTStyler | undefined {
    return MStyle._svtStyler;
  }
}
