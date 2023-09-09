import { x } from "./react";

<x.h1
  as="svg"
  p={{ _: 4, md: 8, dark: { _: 3, md: 2, hover: 3 } }}
  // @ts-expect-error should be typed as SVGElement
  onClick={(e) => e as React.MouseEvent<HTMLHeadingElement, MouseEvent>}
>
  Foo
</x.h1>;
