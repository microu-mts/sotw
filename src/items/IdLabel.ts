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

export function buildIdLabel(arg: IdLabelArg): IdLabel {
  if (typeof arg == "string") {
    return { id: arg, label: arg };
  } else if (Array.isArray(arg)) {
    return { id: arg[0], label: arg[1] };
  } else {
    const r = Object.assign({}, arg);
    if (r.label == undefined) {
      r["label"] = r.id;
    }
    return r as IdLabel;
  }
}

