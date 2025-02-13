import { MStyler } from "./types";

export class MStyle {
  private static _base?: MStyler;
  static get base(): MStyler | undefined {
    return MStyle._base;
  }
  static setBase(styler?: MStyler) {
    MStyle._base = styler;
  }
}
