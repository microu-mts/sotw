import {
  mainTagNormalize,
  twMergeNormalize,
  exlusiveTagNormalize,
} from "./stylersUtils.js";
import { SVTStyler } from "./SVTStyler.js";

const _tailwind_classes_used = "absolute relative inset-0";

export const baseStyler = new SVTStyler(
  [
    {
      vtags: "A",
      classes: "bg-slate-100 text-slate-800",
    },
    {
      vtags: "B",
      classes: "bg-slate-800 text-slate-100",
    },
    {
      vtags: "C",
      classes: "bg-stone-300 text-orange-950",
    },
    {
      vtags: "D",
      classes: "bg-orange-900 text-stone-100",
    },
    {
      vtags: "LG",
      classes: "text-xl p-2",
    },
    {
      vtags: "BASE",
      classes: "text-base p-1",
    },
    {
      vtags: "SM",
      classes: "text-sm p-0.5",
    },
    {
      vtags: "LG",
      stags: "item",
      classes: "text-xl px-2 py-1",
    },
    {
      vtags: "BASE",
      stags: "item",
      classes: "text-base px-1 py-0.5",
    },
    {
      vtags: "SM",
      stags: "item",
      classes: "text-sm p-0.5",
    },
    {
      stags: "item:selected",
      classes: "underline font-bold",
    },
    {
      stags: "item:disabled",
      classes: "blur-[1px]",
    },
    {
      stags: "item/disabler",
      classes: "bg-slate-300/85 cursor-not-allowed",
    },
  ],
  {
    normalizer: twMergeNormalize,
    vtagsNormaliser: (tags) =>
      exlusiveTagNormalize(
        mainTagNormalize(tags, "A"),
        new Set(["SM", "BASE", "LG"]),
        "BASE"
      ),
  }
);
