import { buildItemData, ItemDef } from "./items";
import { Component, createMemo, For } from "solid-js";

import { twMerge } from "tailwind-merge";

type TProps = {
  items: ItemDef[];
  callback?: (id: string) => void;
  class?: string | { ul?: string; li?: string; selected?: string };
  selection?: string;
};

const baseClasses = {
  ul: "bg-stone-200 p-2 flex flex-row flex-wrap gap-2",

  li: "select-none cursor-pointer bg-amber-900 text-white/90 px-1 rounded-md",

  selected: "ring-[3px] ring-offset-1 ring-red-600",
};

export const ButtonBar: Component<TProps> = (props) => {
  const normalizedItems: () => { id: string; label: string }[] = () => {
    const r = [];

    for (const item of props.items) {
      r.push(buildItemData(item));
    }
    return r;
  };

  const callCallback = (id: string) => {
    if (props.callback) {
      props.callback(id);
    }
  };

  const propsClasses = () => {
    if (props.class == undefined) {
      return { ul: "", li: "", selected: "" };
    } else if (typeof props.class == "string") {
      return { ul: "", li: props.class };
    } else {
      return { ul: "", li: "", selected: "", ...props.class };
    }
  };

  const ulClasses = createMemo(() => {
    const _propsClasses = propsClasses();

    const r = twMerge(baseClasses.ul, _propsClasses.ul);

    return r;
  });

  const liClasses = createMemo(() => {
    const _propsClasses = propsClasses();

    const r = twMerge(baseClasses.li, _propsClasses.li);

    return r;
  });

  const liSelectedClasses = createMemo(() => {
    const _propsClasses = propsClasses();

    const r = twMerge(
      liClasses(),

      baseClasses.selected,

      _propsClasses.selected
    );

    return r;
  });

  return (
    <ul class={ulClasses()}>
      <For each={normalizedItems()}>
        {(item) => {
          return (
            <li
              onClick={() => callCallback(item.id)}
              class={
                item.id == props.selection ? liSelectedClasses() : liClasses()
              }
            >
              {item.label}
            </li>
          );
        }}
      </For>
    </ul>
  );
};
