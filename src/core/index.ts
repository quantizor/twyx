import clsx from "clsx";
import { Properties } from "csstype";

export type Breakpoints = "_" | "sm" | "md" | "lg" | "xl";
export type Modes = "dark";
export type States = "hover" | "focus" | "active";

// allow a single layer of nesting for now
export type ResponsiveValues = Partial<
  Record<Breakpoints | Modes, string | number | Partial<Record<Breakpoints | Modes | States, string | number>>>
>;

// empty string means the value is passed directly as a class, as for "display"
const xStyledToTailwindMap = {
  p: "p",
  px: "px",
  py: "py",
  pt: "pt",
  pb: "pb",
  pl: "pl",
  pr: "pr",
  m: "m",
  mx: "mx",
  my: "my",
  mt: "mt",
  mb: "mb",
  ml: "ml",
  mr: "mr",
  w: "w",
  h: "h",
  minWidth: "min-w",
  minHeight: "min-h",
  maxWidth: "max-w",
  maxHeight: "max-h",
  bg: "bg",
  color: "text",
  display: "",
  fontSize: "text",
  fontWeight: "font",
  textAlign: "text",
  lineHeight: "leading",
  letterSpacing: "tracking",
  flex: "flex",
  flexDirection: "flex",
  flexGrow: "flex-grow",
  flexShrink: "flex-shrink",
  order: "order",
  justifyContent: "justify",
  alignItems: "items",
  alignSelf: "self",
  border: "border",
  borderRadius: "rounded",
  zIndex: "z",
  gap: "gap",
  transition: "transition",
  animation: "animate",
  transform: "transform",
  cursor: "cursor",
  resize: "resize",
  userSelect: "select",
} as const satisfies { [key: string]: string };

export type TwyxProps = Record<keyof typeof xStyledToTailwindMap, string | number | ResponsiveValues>;

const convertPropToTailwind = (key: keyof typeof xStyledToTailwindMap, value: string, prefix = ""): string => {
  return prefix + (xStyledToTailwindMap[key] ? xStyledToTailwindMap[key] + "-" : "") + value;
};

const handleResponsiveValues = (
  key: keyof typeof xStyledToTailwindMap,
  value: ResponsiveValues,
  prefix: Breakpoints | Modes | "" = ""
): string => {
  let classes = "";
  for (const [bp, bpValue] of Object.entries(value)) {
    const newPrefix = bp === "_" ? prefix : `${bp}:`;
    if (typeof bpValue === "string") {
      classes += `${newPrefix}${convertPropToTailwind(key, bpValue, prefix)} `;
    } else {
      classes += `${newPrefix}${handleResponsiveValues(key, bpValue as ResponsiveValues, prefix)} `;
    }
  }
  return classes;
};

export const twyx = (props: Partial<TwyxProps>): string => {
  let tailwindClasses = "";

  for (const key of Object.keys(props) as Array<keyof typeof props>) {
    const value = props[key];
    if (typeof value === "object") {
      tailwindClasses += handleResponsiveValues(key, value as ResponsiveValues);
    } else {
      tailwindClasses += `${convertPropToTailwind(key, value as string)} `;
    }
  }

  return tailwindClasses.trim();
};

// Sample Usage
const props: Partial<TwyxProps> = {
  bg: { _: "black", md: "red", dark: { _: "gray", md: "blue" } },
  p: "4",
  mt: "2",
};

console.log(twyx(props)); // Output: "bg-black p-4 mt-2 md:bg-red dark:bg-gray dark:md:bg-blue"
