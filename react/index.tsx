import * as React from "react";
import { Twyx, twyx, twyxPropKeys } from "../core";
import { FastOmit } from "../types";

/**
 * Given an unknown set of props, peel off ones we know are related to twyx.
 */
export const stripTwyxProps = (props: Record<string, unknown>) => {
  return Object.keys(props).reduce(
    (nextProps, key) => {
      if (!twyxPropKeys.has(key)) nextProps[key] = props[key];

      return nextProps;
    },
    {} as Record<string, unknown>,
  );
};

type DynamicElementProps<T extends React.ElementType> = Twyx.Props &
  FastOmit<React.ComponentPropsWithRef<T>, Twyx.PropKeys> & { as?: T };

export const elementFactory = <T extends React.ElementType>(base: T) =>
  React.forwardRef(
    <Target extends React.ElementType>(
      { as, children, className = "", ...rest }: DynamicElementProps<Target>,
      ref: React.Ref<Target>,
    ): React.ReactElement | null => {
      return React.createElement(
        as || base,
        Object.assign(stripTwyxProps(rest), { ref, className: `${twyx(rest)} ${className}`.trim() }),
        children,
      );
    },
  ) as <Target extends React.ElementType = T>(props: DynamicElementProps<Target>) => React.ReactElement | null;

// lazily instantiate a factory for any requested element
const x = new Proxy(
  {} as {
    [K in keyof JSX.IntrinsicElements]: ReturnType<typeof elementFactory<K>>;
  },
  {
    get(target, prop, receiver) {
      if (typeof prop === "string") {
        const typedProp = prop as keyof JSX.IntrinsicElements;

        if (!target[typedProp]) target[typedProp] = elementFactory(typedProp);

        return target[typedProp];
      }

      return Reflect.get(target, prop, receiver);
    },
  },
);

export * from "../core";
export { x };
