import { Component, createMemo, Show } from "solid-js";
import { buildItemData, ItemData, ItemDef } from "./itemData.js";
import { MStyle } from "./mstyle/mstyle.js";
import { twMerge } from "tailwind-merge";
import { flattenSplitArg } from "./mstyle/utils.js";

type TProps = {
  def: ItemDef;
  onClick?: (item: ItemData) => void;
  selected?: boolean;
  disabled?: boolean;
  variant?: string;
  class?:
    | string
    | { item?: string; selected?: string; disabled: string; disabler: string };
};

export const Item: Component<TProps> = (props) => {
  const itemData = () => buildItemData(props.def);

  const currentSTags = () => {
    const r = [] as string[];
    r.push("item");
    if (props.selected) {
      r.push("item:selected");
    }
    if (props.disabled) {
      r.push("item:disabled");
    }

    if (props.variant) {
      r.push("!" + props.variant);
    }

    return r;
  };

  const itemClasses = createMemo(() => {
    const tags = currentSTags();

    const mstyleClasses = MStyle.base ? MStyle.base.classes(tags) : undefined;
    console.log("mstyleClasses:", itemData().id, mstyleClasses);

    let r = twMerge(mstyleClasses);

    if (props.onClick) {
      r = twMerge(r, "select-none cursor-pointer");
    }

    return r;
  });

  const disablerClasses = createMemo(() => {
    if (MStyle.base) {
      const stags = props.variant
        ? `item/disabler !${props.variant}`
        : "item/disabler";
      return twMerge(MStyle.base.classes(stags));
    } else {
      return "";
    }
  });

  function handleClick() {
    if (props.onClick != undefined) {
      props.onClick(itemData());
    }
  }

  return (
    <div onClick={handleClick} class={itemClasses() + " relative"}>
      {itemData().label}
      <Show when={props.disabled}>
        <div
          class={disablerClasses()}
          onClick={(e) => {
            e.stopPropagation();
          }}
        ></div>
      </Show>
    </div>
  );
};
