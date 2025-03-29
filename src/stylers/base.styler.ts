import { SVTStyler } from "./SVTStyler";

const base = new SVTStyler([
  {
    stags: "block",
    classes: "bg-purple-200",
  },

  {
    stags: "item",
    classes: "bg-slate-800 text-slate-100 py-0.5 px-1",
  },
  {
    stags: "item:selected",
    classes: "underline text-pink-200",
  },
  {
    stags: "item:disabled",
    classes: "blur-[2px]",
  },
  {
    stags: "item/disabler",
    classes: "bg-pink-200/85 cursor-not-allowed",
  },
  {
    stags: "item",
    vtags: "B",
    classes: "bg-red-900 text-red-200 py-0.5 px-1",
  },

  {
    stags: "B0",
    classes: "bg-zinc-200",
  },
  {
    stags: "B1",
    classes: "bg-zinc-400",
  },
  {
    stags: "B2",
    classes: "bg-rose-400",
  },
]);

export default base;
