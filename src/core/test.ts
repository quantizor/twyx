import { expect, it } from "bun:test";
import { twyx } from "./";

it("compiles classes", () => {
  expect(twyx({ borderRadius: 2 })).toBe("rounded-2");
  expect(twyx({ display: { _: "block", md: "flex" }, bg: { _: "bg-green-100", dark: "bg-green-900" } })).toBe(
    "block md:flex bg-green-100 dark:bg-green-900"
  );
});
