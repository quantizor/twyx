/**
 * Utilities
 */

type FastOmit<T extends object, U extends string | number | symbol> = {
  [K in keyof T as K extends U ? never : K]: T[K];
};

// Prevents TypeScript from inferring generic argument
export type NoInfer<T> = [T][T extends any ? 0 : never];

export type Substitute<A extends object, B extends object> = FastOmit<A, keyof B> & B;

/**
 * React types, many borrowed and adapted from styled-components
 */
interface ReactExoticComponentWithDisplayName<P extends object = {}> extends React.ExoticComponent<P> {
  displayName?: string | undefined;
}

export type AnyComponent<P extends object = any> = ReactExoticComponentWithDisplayName<P> | React.ComponentType<P>;

export type ReactTarget = keyof JSX.IntrinsicElements | AnyComponent;

export type ReactTargetMaybeCustom =
  | string // allow custom elements, etc.
  | ReactTarget;

export type PolymorphicBaseProps = {
  /**
   * Dynamically adjust the rendered component or HTML tag, e.g.
   * ```
   * const StyledButton = styled.button``
   *
   * <x.button as="a" href="/foo">
   *   I'm an anchor now
   * </x.button>
   * ```
   */
  as?: ReactTarget | undefined;
};

/**
 * Used by PolymorphicComponent to define prop override cascading order.
 */
export type PolymorphicComponentProps<
  BaseProps extends object,
  AsTarget extends ReactTargetMaybeCustom | void,
  // props extracted from "as"
  AsTargetProps extends object = AsTarget extends ReactTarget ? React.ComponentPropsWithRef<AsTarget> : {}
> = NoInfer<FastOmit<Substitute<BaseProps, AsTargetProps>, keyof PolymorphicBaseProps>> &
  FastOmit<PolymorphicBaseProps, "as"> & {
    as?: AsTarget;
  };

/**
 * This type forms the signature for a forwardRef-enabled component
 * that accepts the "as" prop to dynamically change the underlying
 * rendered JSX. The interface will automatically attempt to extract
 * props from the given rendering target to get proper typing for
 * any specialized props in the target component.
 */
export interface PolymorphicComponent<BaseProps extends object> extends React.ForwardRefExoticComponent<BaseProps> {
  <AsTarget extends ReactTargetMaybeCustom | void = void>(
    props: PolymorphicComponentProps<BaseProps, AsTarget>
  ): JSX.Element;
}
