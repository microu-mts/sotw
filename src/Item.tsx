import { Component } from "solid-js";
import { buildItemData, ItemData, ItemDef } from "./itemData.js";
import { MStyle } from "./mstyle/mstyle.js";
import { twMerge } from "tailwind-merge";
import { ensureSplittedString } from "./mstyle/utils.js";

type TProps = {
  def: ItemDef;
  onClick?: (item: ItemData) => void;
  stag?: string | string[];
};

export const Item: Component<TProps> = (props) => {
  const itemData = () => buildItemData(props.def);

  const classes = () => {
    const tags = props.stag
      ? [...ensureSplittedString(props.stag), "item"]
      : ["item"];

    const mstyleClasses = MStyle.base ? MStyle.base.classes(tags) : undefined;
    console.log("mstyleClasses:", itemData().id, mstyleClasses);

    if (props.onClick) {
      return twMerge(mstyleClasses, "select-none cursor-pointer");
    } else {
      return twMerge(mstyleClasses);
    }
  };

  function handleClick() {
    if (props.onClick != undefined) {
      props.onClick(itemData());
    }
  }

  return (
    <div onClick={handleClick} class={classes()}>
      {itemData().label}
    </div>
  );
};
