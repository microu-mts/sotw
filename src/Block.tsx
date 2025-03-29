import { Component, ParentProps } from "solid-js";
import { ISVTStyler, Stylers } from "./stylers/index.js";
import { twMerge } from "tailwind-merge";

type TProps = ParentProps & {
  variant?: string;
  styler?: ISVTStyler;
  level?: number;

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
    const stags = "block" + ` B${props.level ?? 0}`;
    const classes = currentStyler()!.classes(stags,"" ) ?? [];
    if (props.class) {
      classes.push(props.class);
    }
    return twMerge(classes);
  }

  return <div class={blockClasses()}>{props.children}</div>;
};
