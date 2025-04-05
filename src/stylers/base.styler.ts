import {
  mainTagNormalize,
  twMergeNormalize,
  exlusiveTagNormalize,
} from "./stylersUtils.js";
import { SVTStyler } from "./SVTStyler.js";

const base = new SVTStyler(
  [
    {
      stags: "block",
      classes: "bg-white",
    },
    {
      stags: "item",
      classes: "py-0.5 px-1 text-base",
    },
    {
      stags: "item",
      classes: "bg-slate-800 text-slate-100",
    },
    {
      vtags: "A",
      classes: "bg-slate-800 text-slate-100",
    },
    {
      vtags: "B",
      classes: "bg-slate-100 text-slate-800",
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
      stags: "item",
      vtags: "LG",
      classes: "text-xl py-1 px-2 ",
    },
    {
      stags: "item",
      vtags: "BASE",
      classes: "text-base py-0.5 px-1 ",
    },
    {
      stags: "item",
      vtags: "SM",
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

export default base;
