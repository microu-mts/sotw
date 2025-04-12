export interface IdLabel {
  id: string;
  label: string;
  [x: string | symbol]: unknown;
}

export type IdLabelDef = {
  id: string;
  label?: string;
  [x: string | symbol]: unknown;
};

export type IdLabelArg = IdLabelDef | [string, string] | string;

export function buildItemData(def: IdLabelArg): IdLabel {
  if (typeof def == "string") {
    return { id: def, label: def };
  } else if (Array.isArray(def)) {
    return { id: def[0], label: def[1] };
  } else {
    const r = Object.assign({}, def);
    if (r.label == undefined) {
      r["label"] = r.id;
    }
    return r as IdLabel;
  }
}

