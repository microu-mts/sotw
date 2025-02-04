export interface ItemData {
  id: string;
  label: string;
}

export type ItemDef =
  | { id: string; label?: string }
  | [string, string]
  | string;

export function buildItemData(def: ItemDef): ItemData {
  if (typeof def == "string") {
    return { id: def, label: def };
  } else if (Array.isArray(def)) {
    return { id: def[0], label: def[1] };
  } else {
    return { id: def.id, label: def.label ?? def.id };
  }
}
