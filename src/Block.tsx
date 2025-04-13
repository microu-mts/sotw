import type { Component, ParentProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { type ISVTStyler, Stylers, type TagListArgument } from "./stylers/index.js";
import { twMerge } from "tailwind-merge";

type TProps = ParentProps & {
  vtags?: TagListArgument;
  styler?: ISVTStyler;
  class?: string;
  element?: string;
};

export const Block: Component<TProps> = (props) => {
  const elementTag = () => props.element ?? "div";
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

  return (
    <Dynamic component={elementTag()} class={blockClasses()}>
      {props.children}
    </Dynamic>
  );
};
