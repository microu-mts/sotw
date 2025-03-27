import { ISVTStyler } from "./types";
import baseStyler from "./base.styler.js";

export class Stylers {
  private static _base: ISVTStyler | undefined;
  private static _stylersMap = new Map<string, ISVTStyler>();
  static get base(): ISVTStyler | undefined {
    return this._base;
  }
  static setBase(base: ISVTStyler | undefined) {
    return (this._base = base);
  }
  static {
    this._stylersMap.set("default", baseStyler)
    this.setBase(baseStyler);
  }

  static get(name: string): ISVTStyler | undefined {
    return this._stylersMap.get(name);
  }
}
