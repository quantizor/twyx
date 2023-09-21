import * as ReactDOM from "react-dom/client";
import { twyx, x } from "../react/index";

const foo = true;
const className = twyx({
  display: { _: "block", md: "flex" },
  bg: { _: "gray-100", dark: { _: "gray-900" } },
  color: { _: "gray-900", dark: { _: "gray-100" } },
  h: "screen",
  outlineColor: "amber-100/[.50]",
});

export default function HelloWorld() {
  return (
    <x.p className={className} fontSize="xl" p={7}>
      <x.span color="yellow-500" fontWeight={700} mr={1}>
        twyx
      </x.span>{" "}
      is tailwind for css people
    </x.p>
  );
}

const root = ReactDOM.createRoot(document.body);

root.render(<HelloWorld />);
