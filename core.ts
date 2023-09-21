import { DefaultTheme } from "tailwindcss/types/generated/default-theme.d";
import type { BaseColors, BaseColorTransparencies } from "./generated";

// TODO: dev warning if trying to use a custom value with a blank string partial
/**
 * If the value is arbitrary "[something]", compose it with the given partial, e.g.
 *
 * ```ts
 * branch('foo')('bar') === "foo-bar"
 * branch('foo')('[bar]') === "foo-[bar]"
 * branch('foo', (v, p) => `${p}-${v.replace(/b/, '')}`)('bar') === "foo-ar"
 * branch('foo', (v, p) => `${p}-${v.replace(/b/, '')}`)('[bar]') === "foo-[bar]"
 * branch('foo', (v, p) => `${p}-${v === 'bar' ? 'baz' : v}`)('fizz') === "foo-fizz"
 * branch('foo', (v, p) => `${p}-${v === 'bar' ? 'baz' : v}`)('bar') === "foo-baz"
 * ```
 */
const branch = (<Value extends string | number | boolean, Partial extends string = string>(
    partial: Partial,
    prepare?: (value: Value, partial: Partial) => string,
  ) =>
  (value: Value): string => {
    if ((typeof value === "string" && value.startsWith("[") && value.endsWith("]")) || !prepare) {
      if (partial) {
        if (value === "default") {
          return partial;
        } else if (!value) {
          return "";
        } else {
          return `${partial}-${value}`;
        }
      } else {
        return String(value);
      }
    } else {
      return prepare?.(value, partial);
    }
  }) satisfies Twyx.BranchFunc<any>;

export namespace Twyx {
  export type BranchFunc<Value extends string | number | boolean, Partial extends string = string> = (
    partial: Partial,
    prepare?: (value: Value, partial: Partial) => string,
  ) => (value: Value) => string;

  export type Breakpoints = "_" | "sm" | "md" | "lg" | "xl" | "portrait" | "landscape";
  export type Modes = "dark" | "print" | "motionReduce" | "motionSafe" | "contrastMore" | "contrastLess";
  export type States =
    | "hover"
    | "focus"
    | "focusWthin"
    | "focusVisible"
    | "active"
    | "visited"
    | "target"
    | "first"
    | "last"
    | "only"
    | "odd"
    | "even"
    | "firstOfType"
    | "lastOfType"
    | "onlyOfType"
    | "empty"
    | "disabled"
    | "enabled"
    | "checked"
    | "indeterminate"
    | "default"
    | "required"
    | "valid"
    | "invalid"
    | "inRange"
    | "outOfRange"
    | "placeholderShown"
    | "autofill"
    | "readOnly"
    | "firstLetter"
    | "firstLine";
  export type AriaStates =
    | "ariaChecked"
    | "ariaDisabled"
    | "ariaExpanded"
    | "ariaHidden"
    | "ariaPressed"
    | "ariaReadonly"
    | "ariaRequired"
    | "ariaSelected";

  export type ResponsiveKeys = Breakpoints | Modes | States | AriaStates;

  // allow a two layers of nesting for now
  export type ResponsiveValues<V, Depth = 0> =
    | V
    | Partial<Record<ResponsiveKeys, V | Partial<Record<ResponsiveKeys, Record<ResponsiveKeys, V> | V>>>>;

  type Stringify<T extends string | number> = { [K in T]: K extends number ? K | `${K}` : K }[T];
  type ArbitraryValue = `[${string}]`;
  type Spacing =
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 14
    | 16
    | 20
    | 24
    | 28
    | 32
    | 36
    | 40
    | 44
    | 48
    | 52
    | 56
    | 60
    | 64
    | 72
    | 80
    | 96
    | "px"
    | 0.5
    | 1.5
    | 2.5
    | 3.5;
  type SpacingFractions =
    | "1/3"
    | "2/3"
    | "1/4"
    | "2/4"
    | "3/4"
    | "1/5"
    | "2/5"
    | "3/5"
    | "4/5"
    | "1/6"
    | "2/6"
    | "3/6"
    | "4/6"
    | "5/6";

  // TODO: figure out how to assert against the TW types directly to know if they add something and I'm missing a value
  type SpacingScale = Stringify<Spacing>;

  type Positioning = SpacingScale | SpacingFractions | "full" | "auto";

  type Opacity = 0 | 5 | 10 | 20 | 25 | 30 | 40 | 50 | 60 | 70 | 75 | 80 | 90 | 95 | 100;

  /**
   * Given a string union of colors, generate opacity variants.
   */
  type ColorVariants = `${string}/${`[${string}]`}`;

  type BorderRadius = Exclude<keyof DefaultTheme["borderRadius"], "DEFAULT"> | "default";
  type BorderWidth = Stringify<0 | 1 | 2 | 4 | 8>;

  type BlendMode =
    | "normal"
    | "multiply"
    | "screen"
    | "overlay"
    | "darken"
    | "lighten"
    | "color-dodge"
    | "color-burn"
    | "hard-light"
    | "soft-light"
    | "difference"
    | "exclusion"
    | "hue-rotate"
    | "saturation"
    | "color"
    | "luminosity";

  /**
   * Used when adding colors to the globally-available set, e.g.
   *
   * ```ts
   * declare module 'twyx' {
   *   export namespace Twyx {
   *     export interface PropValues extends ColorProps<
   *       BaseColors | `custom-${100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900}`
   *     > {}
   *   }
   * }
   * ```
   */
  export interface ColorProps<
    AllColors extends BaseColors | BaseColorTransparencies,
    Value = AllColors | ColorVariants,
  > {
    accentColor: Value;
    backgroundColor: Value;
    bg: Value;
    borderBottomColor: Value;
    borderColor: Value;
    borderLeftColor: Value;
    borderRightColor: Value;
    borderTopColor: Value;
    boxShadowColor: Value;
    caretColor: Value;
    color: Value;
    fill: Value;
    outlineColor: Value;
    strokeColor: Value;
    textDecorationColor: Value;
  }

  /**
   * Add to `PropValues` to expand the autocomplete options for the given prop if
   * custom utility classes are added.
   */
  export interface PropValues extends ColorProps<BaseColors | BaseColorTransparencies> {
    alignContent: "normal" | "center" | "start" | "end" | "between" | "around" | "evenly" | "stretch" | "baseline";
    alignItems: "start" | "end" | "center" | "baseline" | "stretch";
    alignSelf: "auto" | "start" | "end" | "center" | "stretch" | "baseline";
    animation: keyof DefaultTheme["keyframes"] | "none" | ArbitraryValue;
    appearance: "none";
    aspectRatio: "auto" | "square" | "video" | ArbitraryValue;
    backdropFilter:
      | "blur"
      | `blur-${"none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | ArbitraryValue}`
      | `contrast-${0 | 50 | 75 | 100 | 125 | 150 | 200 | ArbitraryValue}`
      | "drop-shadow"
      | `drop-shadow-${"sm" | "md" | "lg" | "xl" | "2xl" | "none" | ArbitraryValue}`
      | "grayscale"
      | `grayscale-${0 | ArbitraryValue}`
      | `hue-rotate-${0 | 15 | 30 | 60 | 90 | 180 | ArbitraryValue}`
      | "invert"
      | `invert-${0 | ArbitraryValue}`
      | `saturate-${0 | 50 | 100 | 150 | 200 | ArbitraryValue}`
      | "sepia"
      | `sepia-${0 | ArbitraryValue}`;
    backgroundAttachment: "fixed" | "local" | "scroll";
    backgroundBlendMode: BlendMode;
    backgroundClip: "border" | "padding" | "content" | "text";
    backgroundImage:
      | "none"
      | "bg-gradient-to-t"
      | "bg-gradient-to-tr"
      | "bg-gradient-to-r"
      | "bg-gradient-to-br"
      | "bg-gradient-to-b"
      | "bg-gradient-to-bl"
      | "bg-gradient-to-l"
      | "bg-gradient-to-tl"
      | ArbitraryValue;
    backgroundOrigin: "border" | "padding" | "content";
    backgroundPosition:
      | "bottom"
      | "center"
      | "left"
      | "left-bottom"
      | "left-top"
      | "right"
      | "right-bottom"
      | "right-top"
      | "top"
      | ArbitraryValue;
    backgroundRepeat: "repeat" | "no-repeat" | "repeat-x" | "repeat-y" | "repeat-round" | "repeat-space";
    backgroundSize: "auto" | "cover" | "contain" | ArbitraryValue;
    borderBottomLeftRadius: BorderRadius | ArbitraryValue;
    borderBottomRightRadius: BorderRadius | ArbitraryValue;
    borderBottomWidth: BorderWidth | ArbitraryValue;
    borderCollapse: "collapse" | "separate";
    borderLeftWidth: BorderWidth | ArbitraryValue;
    borderRadius: BorderRadius | ArbitraryValue;
    borderRightWidth: BorderWidth | ArbitraryValue;
    borderSpacing:
      | SpacingScale
      | `x-${SpacingScale | ArbitraryValue}`
      | `y-${SpacingScale | ArbitraryValue}`
      | ArbitraryValue;
    borderStyle: "solid" | "dashed" | "dotted" | "double" | "hidden" | "none";
    borderTopLeftRadius: BorderRadius | ArbitraryValue;
    borderTopRightRadius: BorderRadius | ArbitraryValue;
    borderTopWidth: BorderWidth | ArbitraryValue;
    borderWidth: BorderWidth | ArbitraryValue;
    bottom: Positioning | ArbitraryValue;
    boxDecorationBreak: "clone" | "slice";
    boxShadow: "default" | "sm" | "md" | "lg" | "xl" | "2xl" | "inner" | "none" | ArbitraryValue;
    boxSizing: "border" | "content";
    breakAfter: "auto" | "avoid" | "all" | "avoid-page" | "page" | "left" | "right" | "column";
    breakBefore: "auto" | "avoid" | "all" | "avoid-page" | "page" | "left" | "right" | "column";
    breakInside: "auto" | "avoid" | "avoid-page" | "avoid-column";
    captionSide: "top" | "bottom";
    clear: "left" | "right" | "both" | "none";
    columnGap: SpacingScale | ArbitraryValue;
    columns:
      | Stringify<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12>
      | keyof DefaultTheme["columns"]
      | ArbitraryValue;
    content: "none" | ArbitraryValue;
    cursor: keyof DefaultTheme["cursor"] | ArbitraryValue;
    display:
      | "block"
      | "inline-block"
      | "inline"
      | "flex"
      | "inline-flex"
      | "table"
      | "inline-table"
      | "table-caption"
      | "table-cell"
      | "table-column"
      | "table-column-group"
      | "table-footer-group"
      | "table-header-group"
      | "table-row-group"
      | "table-row"
      | "flow-root"
      | "grid"
      | "inline-grid"
      | "contents"
      | "list-item"
      | "hidden"
      | "none";
    filter:
      | "blur-none"
      | "blur-sm"
      | "blur"
      | "blur-md"
      | "blur-lg"
      | "blur-xl"
      | "blur-2xl"
      | "blur-3xl"
      | `blur-[${string}]`
      | `brightness-${0 | 50 | 75 | 90 | 95 | 100 | 105 | 110 | 125 | 150 | 200 | ArbitraryValue}`
      | `contrast-${0 | 50 | 75 | 100 | 125 | 150 | 200 | ArbitraryValue}`
      | "drop-shadow"
      | `drop-shadow-${"sm" | "md" | "lg" | "xl" | "2xl" | "none" | ArbitraryValue}`
      | "grayscale"
      | `grayscale-${0 | ArbitraryValue}`
      | `hue-rotate-${0 | 15 | 30 | 60 | 90 | 180 | ArbitraryValue}`
      | "invert"
      | `invert-${0 | ArbitraryValue}`
      | `saturate-${0 | 50 | 100 | 150 | 200 | ArbitraryValue}`
      | "sepia"
      | `sepia-${0 | ArbitraryValue}`;
    flex: Stringify<1> | "auto" | "initial" | "none" | ArbitraryValue;
    flexBasis: Positioning | ArbitraryValue;
    flexDirection: "row" | "row-reverse" | "col" | "col-reverse";
    flexGrow: Stringify<0> | ArbitraryValue;
    flexShrink: Stringify<0> | ArbitraryValue;
    flexWrap: "wrap" | "nowrap" | "wrap-reverse";
    float: "left" | "right" | "none";
    fontFamily: keyof DefaultTheme["fontFamily"] | ArbitraryValue;
    fontSize: keyof DefaultTheme["fontSize"] | ArbitraryValue;
    fontSmoothing: "antialiased" | "subpixel-antialiased";
    fontStyle: "italic" | "not-italic";
    fontVariantNumeric:
      | "normal-nums"
      | "ordinal"
      | "slashed-zero"
      | "lining-nums"
      | "oldstyle-nums"
      | "proportional-nums"
      | "tabular-nums"
      | "diagonal-fractions"
      | "stacked-fractions";
    fontWeight:
      | Stringify<100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900>
      | keyof DefaultTheme["fontWeight"]
      | ArbitraryValue;
    gap: SpacingScale | ArbitraryValue;
    gridAutoColumns: keyof DefaultTheme["gridAutoColumns"] | ArbitraryValue;
    gridAutoFlow: "row" | "col" | "dense" | "row-dense" | "col-dense";
    gridAutoRows: keyof DefaultTheme["gridAutoRows"] | ArbitraryValue;
    gridColumn: keyof DefaultTheme["gridColumn"] | ArbitraryValue;
    gridColumnEnd: keyof DefaultTheme["gridColumnEnd"] | ArbitraryValue;
    gridColumnStart: keyof DefaultTheme["gridColumnStart"] | ArbitraryValue;
    gridRow: keyof DefaultTheme["gridRow"] | ArbitraryValue;
    gridRowEnd: keyof DefaultTheme["gridRowEnd"] | ArbitraryValue;
    gridRowStart: keyof DefaultTheme["gridRowStart"] | ArbitraryValue;
    gridTemplateColumns: keyof DefaultTheme["gridTemplateColumns"] | ArbitraryValue;
    gridTemplateRows: keyof DefaultTheme["gridTemplateRows"] | ArbitraryValue;
    h: Positioning | "screen" | "min" | "max" | "fit" | ArbitraryValue;
    hyphens: "none" | "manual" | "auto";
    inset: Positioning | ArbitraryValue;
    isolation: "default" | "auto";
    justifyContent: "normal" | "center" | "start" | "end" | "between" | "around" | "evenly" | "stretch";
    justifyItems: "start" | "end" | "center" | "stretch";
    justifySelf: "start" | "end" | "center" | "stretch" | "auto";
    left: Positioning | ArbitraryValue;
    letterSpacing: "tighter" | "tight" | "normal" | "wide" | "wider" | "widest" | ArbitraryValue;
    lineClamp: Stringify<1 | 2 | 3 | 4 | 5 | 6> | "none" | ArbitraryValue;
    lineHeight: Stringify<3 | 4 | 5 | 6 | 7 | 8 | 9 | 10> | keyof DefaultTheme["lineHeight"] | ArbitraryValue;
    listStyleImage: "none" | ArbitraryValue;
    listStylePosition: "inside" | "outside";
    listStyleType: "none" | "disc" | "decimal" | ArbitraryValue;
    m: SpacingScale | "auto" | ArbitraryValue;
    maxHeight: SpacingScale | "full" | "screen" | "min" | "max" | "fit" | "none" | ArbitraryValue;
    maxWidth:
      | Stringify<0>
      | "none"
      | "xs"
      | "sm"
      | "md"
      | "lg"
      | "xl"
      | "2xl"
      | "3xl"
      | "4xl"
      | "5xl"
      | "6xl"
      | "7xl"
      | "full"
      | "min"
      | "max"
      | "fit"
      | "prose"
      | "screen-sm"
      | "screen-md"
      | "screen-lg"
      | "screen-xl"
      | "screen-2xl"
      | ArbitraryValue;
    mb: SpacingScale | "auto" | ArbitraryValue;
    me: SpacingScale | "auto" | ArbitraryValue;
    minHeight: Stringify<0> | "full" | "min" | "max" | "fit" | "screen" | ArbitraryValue;
    minWidth: Stringify<0> | "full" | "min" | "max" | "fit" | ArbitraryValue;
    mixBlendMode: BlendMode | "plus-lighter";
    ml: SpacingScale | "auto" | ArbitraryValue;
    mr: SpacingScale | "auto" | ArbitraryValue;
    ms: SpacingScale | "auto" | ArbitraryValue;
    mt: SpacingScale | "auto" | ArbitraryValue;
    mx: SpacingScale | "auto" | ArbitraryValue;
    my: SpacingScale | "auto" | ArbitraryValue;
    objectFit: "contain" | "cover" | "fill" | "none" | "scale-down";
    objectPosition: keyof DefaultTheme["objectPosition"] | ArbitraryValue;
    opacity: Stringify<Opacity> | ArbitraryValue;
    order: Stringify<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12> | keyof DefaultTheme["order"] | ArbitraryValue;
    outlineOffset: Stringify<0 | 1 | 2 | 4 | 8> | ArbitraryValue;
    outlineStyle: "solid" | "none" | "dashed" | "dotted" | "double";
    outlineWidth: Stringify<0 | 1 | 2 | 4 | 8> | ArbitraryValue;
    overflow: "auto" | "hidden" | "clip" | "visible" | "scroll";
    overflowX: "auto" | "hidden" | "clip" | "visible" | "scroll";
    overflowY: "auto" | "hidden" | "clip" | "visible" | "scroll";
    overscrollBehavior: "auto" | "contain" | "none";
    overscrollBehaviorX: "auto" | "contain" | "none";
    overscrollBehaviorY: "auto" | "contain" | "none";
    p: SpacingScale | ArbitraryValue;
    pb: SpacingScale | ArbitraryValue;
    pe: SpacingScale | ArbitraryValue;
    pl: SpacingScale | ArbitraryValue;
    placeContent: "center" | "start" | "end" | "between" | "around" | "evenly" | "stretch" | "baseline";
    placeItems: "start" | "end" | "center" | "stretch" | "baseline";
    placeSelf: "auto" | "start" | "end" | "center" | "stretch";
    pointerEvents: "none" | "auto";
    position: "static" | "fixed" | "absolute" | "relative" | "sticky";
    pr: SpacingScale | ArbitraryValue;
    ps: SpacingScale | ArbitraryValue;
    pt: SpacingScale | ArbitraryValue;
    px: SpacingScale | ArbitraryValue;
    py: SpacingScale | ArbitraryValue;
    resize: "none" | "x" | "y" | "both";
    right: Positioning | ArbitraryValue;
    rowGap: SpacingScale | ArbitraryValue;
    scrollMargin: SpacingScale | ArbitraryValue;
    scrollPadding: SpacingScale | ArbitraryValue;
    scrollSnapAlign: "start" | "end" | "center" | "none";
    scrollSnapStop: "normal" | "always";
    scrollSnapType:
      | "none"
      | "x"
      | `x-${"mandatory" | "proximity"}`
      | "y"
      | `y-${"mandatory" | "proximity"}`
      | "both"
      | `both-${"mandatory" | "proximity"}`;
    strokeWidth: Stringify<0 | 1 | 2> | ArbitraryValue;
    tableLayout: "auto" | "fixed";
    textAlign: "left" | "center" | "right" | "justify" | "start" | "end";
    textDecoration: "underline" | "line-through" | "no-underline" | "overline";
    textDecorationStyle: "solid" | "double" | "dotted" | "dashed" | "wavy";
    textDecorationThickness:
      | Stringify<0 | 1 | 2 | 4 | 8>
      | keyof DefaultTheme["textDecorationThickness"]
      | ArbitraryValue;
    textIndent: SpacingScale | ArbitraryValue;
    textOverflow: "truncate" | "ellipsis" | "clip";
    textTransform: "uppercase" | "lowercase" | "capitalize" | "normal-case" | "none";
    textUnderlineOffset: "auto" | Stringify<0 | 1 | 2 | 4 | 8>;
    top: Positioning | ArbitraryValue;
    touchAction:
      | "auto"
      | "none"
      | "pan-x"
      | "pan-left"
      | "pan-right"
      | "pan-y"
      | "pan-up"
      | "pan-down"
      | "pinch-zoom"
      | "manipulation";
    transform:
      | `scale${"" | "-x" | "-y"}-${keyof DefaultTheme["scale"] | ArbitraryValue}`
      | `rotate-${keyof DefaultTheme["rotate"] | ArbitraryValue}`
      | `translate-${"" | "-x" | "-y"}${SpacingScale | SpacingFractions | "full" | ArbitraryValue}`
      | `skew-${"x" | "y"}-${keyof DefaultTheme["skew"] | ArbitraryValue}`;
    transformOrigin: keyof DefaultTheme["transformOrigin"] | ArbitraryValue;
    transitionDelay: Stringify<0 | 75 | 100 | 150 | 200 | 300 | 500 | 700 | 1000> | ArbitraryValue;
    transitionDuration: Stringify<0 | 75 | 100 | 150 | 200 | 300 | 500 | 700 | 1000> | ArbitraryValue;
    transitionProperty: "default" | "none" | "all" | "colors" | "opacity" | "shadow" | "transform" | ArbitraryValue;
    transitionTimingFunction: "linear" | "in" | "out" | "in-out" | ArbitraryValue;
    userSelect: "none" | "text" | "all" | "auto";
    verticalAlign:
      | "baseline"
      | "top"
      | "middle"
      | "bottom"
      | "text-top"
      | "text-bottom"
      | "sub"
      | "super"
      | ArbitraryValue;
    visibility: "visible" | "invisible" | "collapse";
    w: Positioning | "screen" | "min" | "max" | "fit" | ArbitraryValue;
    whiteSpace: "normal" | "nowrap" | "pre" | "pre-line" | "pre-wrap" | "break-spaces";
    willChange: "auto" | "scroll" | "contents" | "transform" | ArbitraryValue;
    wordBreak: "normal" | "words" | "all" | "keep";
    zIndex: Stringify<0 | 10 | 20 | 30 | 40 | 50> | "auto" | ArbitraryValue;
  }

  export type PropKeys = keyof PropValues;

  export type Transforms = { [K in PropKeys]: ReturnType<BranchFunc<PropValues[K]>> };

  export type Props = { [K in PropKeys]?: ResponsiveValues<PropValues[K]> };
}

const fontWeightMap = {
  "100": "thin",
  "200": "extralight",
  "300": "light",
  "400": "normal",
  "500": "medium",
  "600": "semibold",
  "700": "bold",
  "800": "extrabold",
  "900": "black",
};

const borderWidth = (v: Twyx.PropValues["borderWidth"], p: string): string => (String(v) === "1" ? p : `${p}-${v}`);

/**
 * For each twyx-enabled styling prop, the root class is provided along with an optional
 * `prepare` function for customizing the given value if necessary.
 *
 * The types are doing the heavy lifting here to ensure appropriate values are provided,
 * the algorithm is intentionally simplistic for performance and size.
 *
 * Arbitrary values still require the square-bracket notation: "[foo]"
 */
const transforms: Twyx.Transforms = {
  accentColor: branch("accent"),
  alignContent: branch("content"),
  alignItems: branch("items"),
  alignSelf: branch("self"),
  animation: branch("animate"),
  appearance: branch("appearance"),
  aspectRatio: branch("aspect"),
  backdropFilter: branch("backdrop"),
  backgroundAttachment: branch("bg"),
  backgroundBlendMode: branch("bg-blend"),
  backgroundClip: branch("bg-clip"),
  backgroundColor: branch("bg"),
  backgroundImage: branch("bg"),
  backgroundOrigin: branch("bg-origin"),
  backgroundPosition: branch("bg"),
  backgroundRepeat: branch("bg"),
  backgroundSize: branch("bg"),
  bg: branch("bg"),
  borderBottomColor: branch("border-b"),
  borderBottomLeftRadius: branch("rounded-bl"),
  borderBottomRightRadius: branch("rounded-br"),
  borderBottomWidth: branch("border-b", borderWidth),
  borderCollapse: branch("border"),
  borderColor: branch("border"),
  borderLeftColor: branch("border-l"),
  borderLeftWidth: branch("border-l", borderWidth),
  borderRadius: branch("rounded"),
  borderRightColor: branch("border-r"),
  borderRightWidth: branch("border-r", borderWidth),
  borderSpacing: branch("border-spacing"),
  borderStyle: branch("border"),
  borderTopColor: branch("border-t"),
  borderTopLeftRadius: branch("rounded-tl"),
  borderTopRightRadius: branch("rounded-tr"),
  borderTopWidth: branch("border-t", borderWidth),
  borderWidth: branch("border", borderWidth),
  bottom: branch("bottom"),
  boxDecorationBreak: branch("box-decoration"),
  boxShadow: branch("shadow", (v, p): string => (v === "default" ? p : `${p}-${v}`)),
  boxShadowColor: branch("shadow"),
  boxSizing: branch("box"),
  breakAfter: branch("break-after"),
  breakBefore: branch("break-before"),
  breakInside: branch("break-inside"),
  captionSide: branch("caption"),
  caretColor: branch("caret"),
  clear: branch("clear"),
  color: branch("text"),
  columnGap: branch("gap-x"),
  columns: branch("columns"),
  content: branch("content"),
  cursor: branch(`cursor-`),
  display: branch("", (v): string => (v === "none" ? "hidden" : v)),
  fill: branch("fill"),
  filter: branch(""),
  flex: branch("flex"),
  flexBasis: branch("basis"),
  flexDirection: branch("flex"),
  flexGrow: branch("grow", (v, p): string => (String(v) === "1" ? "grow" : p + v)),
  flexShrink: branch("shrink", (v, p): string => (String(v) === "1" ? "grow" : p + v)),
  flexWrap: branch("flex"),
  float: branch("float"),
  fontFamily: branch("font"),
  fontSize: branch("text"),
  fontSmoothing: branch(""),
  fontStyle: branch(""),
  fontVariantNumeric: branch(""),
  fontWeight: branch("font", (v, p): string =>
    Number.isNaN(parseInt(v as string)) ? `${p}-${v}` : `${p}-${fontWeightMap[v as keyof typeof fontWeightMap]}`,
  ),
  gap: branch("gap"),
  gridAutoColumns: branch("auto-cols"),
  gridAutoFlow: branch("grid-flow"),
  gridAutoRows: branch("auto-rows"),
  gridColumn: branch("col-span"),
  gridColumnEnd: branch("col-end"),
  gridColumnStart: branch("col-start"),
  gridRow: branch("row"),
  gridRowEnd: branch("row-end"),
  gridRowStart: branch("row-start"),
  gridTemplateColumns: branch("grid-cols"),
  gridTemplateRows: branch("grid-rows"),
  h: branch("h"),
  hyphens: branch("hyphens"),
  inset: branch("inset"),
  isolation: branch("isolation", (v, p): string => (v === "default" ? "isolate" : `${p}-${v}`)),
  justifyContent: branch("justify"),
  justifyItems: branch("justify-items"),
  justifySelf: branch("justify-self"),
  left: branch("left"),
  letterSpacing: branch("tracking"),
  lineClamp: branch("line-clamp"),
  lineHeight: branch("leading"),
  listStyleImage: branch("list-image"),
  listStylePosition: branch("list"),
  listStyleType: branch("list"),
  m: branch("m"),
  maxHeight: branch("max-h"),
  maxWidth: branch("max-w"),
  mb: branch("mb"),
  me: branch("me"),
  minHeight: branch("min-h"),
  minWidth: branch("min-w"),
  mixBlendMode: branch("mix-blend"),
  ml: branch("me"),
  mr: branch("me"),
  ms: branch("ms"),
  mt: branch("mt"),
  mx: branch("mx"),
  my: branch("my"),
  objectFit: branch("object"),
  objectPosition: branch("object"),
  opacity: branch("opacity"),
  order: branch("order"),
  outlineColor: branch("outline"),
  outlineOffset: branch("outline-offset"),
  outlineStyle: branch("outline", (v, p): string => (v === "solid" ? p : `${p}-${v}`)),
  outlineWidth: branch("outline", borderWidth),
  overflow: branch("overflow"),
  overflowX: branch("overflow-x"),
  overflowY: branch("overflow-y"),
  overscrollBehavior: branch("overscroll"),
  overscrollBehaviorX: branch("overscroll-x"),
  overscrollBehaviorY: branch("overscroll-y"),
  p: branch("p"),
  pb: branch("pb"),
  pe: branch("pe"),
  pl: branch("pl"),
  placeContent: branch("place-content"),
  placeItems: branch("place-items"),
  placeSelf: branch("place-self"),
  pointerEvents: branch("pointer-events"),
  position: branch(""),
  pr: branch("pr"),
  ps: branch("ps"),
  pt: branch("pt"),
  px: branch("px"),
  py: branch("py"),
  resize: branch("resize", (v, p): string => (v === "both" ? p : `${p}-${v}`)),
  right: branch("right"),
  rowGap: branch("gap-y"),
  scrollMargin: branch("scroll-m"),
  scrollPadding: branch("scroll-p"),
  scrollSnapAlign: branch("snap"),
  scrollSnapStop: branch("snap"),
  scrollSnapType: branch("snap", (v, p): string => {
    const [direction, strictness] = v.split("-");

    return strictness ? `${p}-${direction} ${p}-${strictness}` : `${p}-${direction}`;
  }),
  strokeColor: branch("stroke"),
  strokeWidth: branch("stroke"),
  tableLayout: branch("table"),
  // text: branch("text"),
  textAlign: branch("text"),
  textDecoration: branch(""),
  textDecorationColor: branch("decoration"),
  textDecorationStyle: branch("decoration"),
  textDecorationThickness: branch("decoration"),
  textIndent: branch("indent"),
  textOverflow: branch("text", (v, p): string => (v === "truncate" ? v : `${p}-${v}`)),
  textTransform: branch("", (v, p): string => (v === "none" ? "normal-case" : v)),
  textUnderlineOffset: branch("underline-offset"),
  top: branch("top"),
  touchAction: branch("touch"),
  transform: branch(""),
  transformOrigin: branch("origin"),
  transitionDelay: branch("delay"),
  transitionDuration: branch("duration"),
  transitionProperty: branch("transition", (v, p): string => (v === "default" ? p : `${p}-${v}`)),
  transitionTimingFunction: branch("ease"),
  userSelect: branch("select"),
  verticalAlign: branch("align"),
  visibility: branch(""),
  w: branch("w"),
  whiteSpace: branch("whitespace"),
  willChange: branch("will-change"),
  wordBreak: branch("break"),
  zIndex: branch("z"),
};

const convertPropToTailwind = <Key extends keyof Twyx.Transforms>(
  key: Key,
  value: Twyx.PropValues[Key],
  prefix = "",
): string => prefix + (transforms[key] ? transforms[key](value) : value);

const handleResponsiveValues = (
  key: keyof typeof transforms,
  value: Twyx.ResponsiveValues<any>,
  prefix: string = "",
): string => {
  let classes = "";
  for (const [childKey, childValue] of Object.entries(value)) {
    const newPrefix = childKey === "_" ? "" : prefix ? `${prefix}:${childKey}:` : `${childKey}:`;

    if (typeof childValue !== "object") {
      classes += `${newPrefix}${convertPropToTailwind(key, childValue as any)} `;
    } else {
      classes += `${newPrefix}${handleResponsiveValues(
        key,
        childValue as Twyx.ResponsiveValues<any>,
        prefix ? `${prefix}:${childKey}` : childKey,
      )} `;
    }
  }

  return classes;
};

/**
 * Given a twyx prop object, synthesize all relevant tailwind classes.
 *
 * Responsive syntax is allowed and encouraged. "_" is always considered the default
 * and is not required; you may exclusively target higher breakpoints if desired.
 *
 * ```ts
 * twyx({ bg: { _: "black", md: "red-100", dark: { _: "gray-100", md: "zinc-900" } } });
 * // 'bg-black md:bg-red-100 dark:bg-gray-100 dark:md:bg-zinc-900'
 * ```
 *
 * You may also pass another class string as the second argument for convenience and it
 * will be appended to the end of the generated classes. This makes twyx more pleasant
 * to compose with manually-provided tailwind classes for example.
 *
 * ```ts
 * twyx({ color: 'red-100' }, 'foo');
 * // 'text-red-100 foo'
 * ```
 */
export const twyx = (props: Twyx.Props, className: string = ""): string => {
  let tailwindClasses = "";

  for (const key of Object.keys(props) as Array<keyof typeof props>) {
    const value = props[key];
    if (typeof value === "object") {
      tailwindClasses += handleResponsiveValues(key, value as Twyx.ResponsiveValues<any>);
    } else {
      tailwindClasses += `${convertPropToTailwind(key, value as any)} `;
    }
  }

  return `${tailwindClasses} ${className}`.trim().replace(/(\s{2,})/g, " ");
};

/**
 * Can be used to identify prop keys that twyx will intercept.
 */
export const twyxPropKeys = new Set(Object.keys(transforms));
