import { twyx, x } from "../src/react";

const foo = true;
const className = twyx({
  display: { _: "block", md: "flex" },
  bg: { _: "green-100", dark: { _: "green-900", hover: "green-800" } },
});

export default function HelloWorld() {
  return (
    <x.p
      // TODO: remove need for square brackets
      borderRadius={foo ? "[3px]" : "sm"}
      // TODO: fix typing to allow for deep objects in JSX
      color={{ _: "red-100", dark: { _: "red-900", hover: "red-800" } }}
    >
      You could say we were made for this.
    </x.p>
  );
}
