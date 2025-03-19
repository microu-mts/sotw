import { Component } from "solid-js";
import { buildItemData, ItemData, ItemDef } from "./itemData.js";

type TProps = {
  def: ItemDef;
  onClick?: (item: ItemData) => void;
};

export const Item: Component<TProps> = (props) => {
  const itemData = () => buildItemData(props.def);

  const classes = () => {
    if (props.onClick) {
      return "select-none cursor-pointer";
    } else {
      return "";
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
