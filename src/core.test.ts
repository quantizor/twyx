import { expect, it } from "bun:test";
import { Twyx, twyx } from "./core";

// Sample Usage
const props: Partial<Twyx.Props> = {
  bg: { _: "black", md: "red-100", dark: { _: "gray-100", md: "zinc-900" } },
  p: "4",
  mt: "2",
};

console.log(twyx({ borderRadius: "default" }));

// console.log(twyx(props)): "bg-black p-4 mt-2 md:bg-red dark:bg-gray dark:md:bg-blue"

it("handles default compilations", () => {
  expect(twyx({ borderRadius: "default" })).toBe("rounded");
  expect(twyx({ resize: "both" })).toBe("resize");
});

it("composes additional given class", () => {
  expect(twyx({ borderRadius: "default" }, "foo")).toBe("rounded foo");
});

it("compiles complex branching", () => {
  expect(twyx({ display: { _: "block", md: { _: "flex", dark: "table", print: "inline" } } })).toBe(
    "block md:flex md:dark:table md:print:inline",
  );

  expect(twyx({ display: { _: "block", md: "flex" }, bg: { _: "green-100", dark: "green-900" } })).toBe(
    "block md:flex bg-green-100 dark:bg-green-900",
  );

  expect(
    twyx({
      color: { _: "red-100", hover: { _: "red-200", dark: "red-800" }, first: { _: "orange-100", only: "orange-200" } },
    }),
  ).toBe("text-red-100 hover:text-red-200 hover:dark:text-red-800 first:text-orange-100 first:only:text-orange-200");
});
