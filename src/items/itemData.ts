export interface ItemData {
  id: string;
  label: string;
  [x: string | symbol]: unknown;
}

export type ItemDefData = {
  id: string;
  label?: string;
  [x: string | symbol]: unknown;
};

export type ItemDef = ItemDefData | [string, string] | string;

export function buildItemData(def: ItemDef): ItemData {
  if (typeof def == "string") {
    return { id: def, label: def };
  } else if (Array.isArray(def)) {
    return { id: def[0], label: def[1] };
  } else {
    const r = Object.assign({}, def);
    if (r.label == undefined) {
      r["label"] = r.id;
    }
    return r as ItemData;
  }
}

