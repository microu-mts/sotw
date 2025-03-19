import { buildItemData, ItemData, ItemDef, ItemDefData } from "./itemData";
import { Component, createMemo, For, JSX } from "solid-js";

import { twMerge } from "tailwind-merge";

type TProps = {
  items: ItemDef[];
  callback?: (id: string, item: ItemData) => void;
  class?: string | { ul?: string; li?: string; selected?: string };
  selection?: string;
};

const baseClasses = {
  ul: "bg-transparent p-2 flex flex-row flex-wrap gap-2",

  li: "select-none cursor-pointer bg-slate-900 text-white/90 px-1 rounded-sm",

  selected: "font-bold text-purple-400/80",
};

export function ButtonBar(props: TProps): JSX.Element {

  
  const normalizedItems: () => { id: string; label: string }[] = () => {
    const r = [];
    
    for (const item of props.items) {
      r.push(buildItemData(item));
    }
    return r;
  };
  
  const callCallback = (item: ItemData) => {
    if (props.callback) {
      props.callback(item.id, item);
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
  
  console.log("Create ButtonBar with items:", props.items);
  return (
    <ul class={ulClasses()}>
      <For each={normalizedItems()}>
        {(item) => {
          return (
            <li
              onClick={() => callCallback(item)}
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
}
