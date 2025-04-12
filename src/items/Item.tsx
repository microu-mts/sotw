import { Component, createMemo, Show } from "solid-js";
import { twMerge } from "tailwind-merge";
import { Stylers } from "../stylers/Stylers.js";
import { buildItemData, IdLabel, IdLabelArg } from "./itemData.js";
import { ISVTStyler, TagListArgument } from "../stylers/index.js";

export type TItemClass = {
  item?: string;
  selected?: string;
  disabled?: string;
  disabler?: string;
};

export type TItemClassArg = string | TItemClass;

export type TItemProps = {
  def: IdLabelArg;
  onClick?: (item: IdLabel) => void;
  selected?: boolean;
  disabled?: boolean;
  vtags?: TagListArgument;
  styler?: ISVTStyler;
  class?: TItemClassArg;
  clickableWhendisabled?: boolean;
};

export const Item: Component<TItemProps> = (props) => {
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
    return r;
  };

  const currentStyler = () => {
    if (props.styler) {
      return props.styler;
    } else {
      return Stylers.base;
    }
  };

  const classProp = createMemo<TItemClass>(() => {
    if (props.class == undefined) {
      return {};
    } else if (typeof props.class == "string") {
      return { item: props.class };
    } else {
      return props.class;
    }
  });

  const itemClasses = createMemo(() => {
    const stags = currentSTags();

    const styler = currentStyler();

    const rawClasses = [] as (string | undefined)[];

    const stylerClasses = styler
      ? styler.classes(stags, props.vtags)
      : undefined;
    rawClasses.push(...(stylerClasses ?? []));

    if (props.onClick) {
      rawClasses.push("select-none cursor-pointer");
    }

    const customClasses = classProp();
    if (customClasses.item) {
      rawClasses.push(customClasses.item);
    }
    if (props.selected && customClasses.selected) {
      rawClasses.push(customClasses.selected);
    }
    if (props.disabled && customClasses.disabled) {
      rawClasses.push(customClasses.disabled);
    }

    rawClasses.push("relative");
    const r = twMerge(rawClasses);
    return r;
  });

  const disablerClasses = createMemo(() => {
    const rawClasses = [] as string[];
    if (currentStyler()) {
      rawClasses.push(
        ...currentStyler()!.classes("item/disabler", props.vtags)!
      );
    }
    if (classProp().disabler) {
      rawClasses.push(classProp().disabler!);
    }
    rawClasses.push("absolute inset-0");
    const r = twMerge(rawClasses);
    return r;
  });

  function handleClick() {
    if (props.onClick != undefined) {
      props.onClick(itemData());
    }
  }

  return (
    <div onClick={handleClick} class={itemClasses()}>
      {itemData().label}
      <Show when={props.disabled}>
        <div
          class={disablerClasses()}
          onClick={(e) => {
            if (!props.clickableWhendisabled) {
              e.stopPropagation();
            }
          }}
        ></div>
      </Show>
    </div>
  );
};
