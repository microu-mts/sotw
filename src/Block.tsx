import { Component, ParentProps } from "solid-js";
import { ISVTStyler, Stylers } from "./stylers/index.js";
import { twMerge } from "tailwind-merge";

type TProps = ParentProps & {
  vtags?: string | string;
  styler?: ISVTStyler;
  class?: string;
};

export const Block: Component<TProps> = (props) => {
  const currentStyler = () => {
    if (props.styler) {
      return props.styler;
    } else {
      return Stylers.base;
    }
  };

  function blockClasses() {
    const stags = "block";
    const classes = currentStyler()!.classes(stags, props.vtags) ?? [];
    if (props.class) {
      classes.push(props.class);
    }
    return twMerge(classes);
  }

  return <div class={blockClasses()}>{props.children}</div>;
};
