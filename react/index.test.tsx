import { describe, expect, it } from "bun:test";
import rtr from "react-test-renderer";
import { x } from ".";

/**
 * Type tests
 */

<x.h1
  as="svg"
  p={{ _: 4, md: 8, dark: { _: 3, md: 2, hover: 3 } }}
  // @ts-expect-error should be typed as SVGElement
  onClick={(e) => e as React.MouseEvent<HTMLHeadingElement, MouseEvent>}
>
  Foo
</x.h1>;

/**
 * Unit tests
 */
describe("react integration", () => {
  it('"as" prop changes the rendered node', () => {
    expect(rtr.create(<x.p as="div">Hello</x.p>).toJSON()).toHaveProperty("type", "div");
  });

  it("className is composed after generated tw classes", () => {
    expect(
      rtr
        .create(
          <x.p className="foo" color="red-100">
            Hello
          </x.p>,
        )
        .toJSON(),
    ).toHaveProperty("props.className", "text-red-100 foo");
  });
});
