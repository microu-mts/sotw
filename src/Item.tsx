import { Component } from "solid-js";
import { buildItemData, ItemData, ItemDef } from "./itemData.js";
import { MStyle } from "./mstyle/mstyle.js";
import { twMerge } from "tailwind-merge";

type TProps = {
  def: ItemDef;
  onClick?: (item: ItemData) => void;
};

export const Item: Component<TProps> = (props) => {
  const itemData = () => buildItemData(props.def);

  const classes = () => {
    const mstyleClasses = MStyle.base ? MStyle.base.classes("item") : undefined;

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
