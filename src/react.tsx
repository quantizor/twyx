import clsx from "clsx";
import * as React from "react";
import { twyx, TwyxProps } from "./core";
import type { PolymorphicComponent } from "./types";

type DynamicElementProps<T extends React.ElementType = React.ElementType> = React.ComponentProps<T> &
  Partial<TwyxProps> & { as?: T };

export const elementFactory = <T extends React.ElementType>(base: T) =>
  React.forwardRef(
    <As extends React.ElementType>(
      { children, as = base, className, ...rest }: DynamicElementProps<As>,
      ref: React.Ref<As>
    ) => {
      return React.createElement(as, { ref, className: clsx(twyx(rest), className) }, children);
    }
  ) as PolymorphicComponent<DynamicElementProps<T>>;

// this should include all HTML element tags that support styling
const elements = [
  "a",
  "abbr",
  "address",
  "area",
  "article",
  "aside",
  "audio",
  "b",
  "bdi",
  "bdo",
  "big",
  "blockquote",
  "body",
  "br",
  "button",
  "canvas",
  "caption",
  "cite",
  "code",
  "col",
  "colgroup",
  "data",
  "datalist",
  "dd",
  "del",
  "details",
  "dfn",
  "dialog",
  "div",
  "dl",
  "dt",
  "em",
  "embed",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "hr",
  "html",
  "i",
  "iframe",
  "img",
  "input",
  "ins",
  "kbd",
  "keygen",
  "label",
  "legend",
  "li",
  "main",
  "map",
  "mark",
  "menu",
  "menuitem",
  "meter",
  "nav",
  "object",
  "ol",
  "optgroup",
  "option",
  "output",
  "p",
  "picture",
  "pre",
  "progress",
  "q",
  "rp",
  "rt",
  "ruby",
  "s",
  "samp",
  "section",
  "select",
  "small",
  "source",
  "span",
  "strong",
  "sub",
  "summary",
  "sup",
  "table",
  "tbody",
  "td",
  "textarea",
  "tfoot",
  "th",
  "thead",
  "time",
  "tr",
  "u",
  "ul",
  "var",
  "video",
  "wbr", // SVG
  "circle",
  "clipPath",
  "defs",
  "ellipse",
  "foreignObject",
  "g",
  "image",
  "line",
  "linearGradient",
  "marker",
  "mask",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "radialGradient",
  "rect",
  "stop",
  "svg",
  "text",
  "tspan",
] as const;

type ElementUnion = (typeof elements)[number];

const x: { [K in ElementUnion]: ReturnType<typeof elementFactory<K>> } = {} as any;

elements.forEach((el) => {
  // @ts-expect-error it's ok
  x[el] = elementFactory(el);
});

export { x };
