# twyx

tailwind for css people

> Want to add something or make a change? See [CONTRIBUTING](./CONTRIBUTING.md)!

## install

```sh
bun add twyx
```

If you are using one of the supported framework(s) below, any additional dependencies are listed.

| framework | install command                           |
| --------- | ----------------------------------------- |
| react     | `bun add react; bun add -D @types/react;` |

### configure tailwind to use the twyx transformer

twyx is able to autogenerate tailwind classes at build time using a custom transformer. Follow the example below and hook up the transformer to any file types where twyx usage occurs.

```ts
// tailwind.config.ts

import type { Config } from "tailwindcss";
import { transformTwyxProps } from "twyx/transformer";

export default {
  content: {
    files: [
      /* file glob patterns that might contain tailwind syntax */
    ],
    transform: {
      js: transformTwyxProps,
      tsx: transformTwyxProps,
    },
  },
} as Config;
```

## usage

All the normal rules of tailwind still apply, namely templating class names is strictly forbidden.

<strong style="color: limegreen">do</strong>

```ts
twyx({
  borderColor: condition ? "green-200" : "green-500",
  color: "red-500",
});
```

<strong style="color: red">don't</strong>

```ts
twyx({
  borderColor: `green-${condition ? 200 : 500}`,
});
```

> **Why?** Tailwind runs a simple scanner over files to determine if classes it knows about are in use. If you write
> conditional styles in such a way that the whole string is not present at build time, the scanner will not work and
> the class will not be generated unless you [manually safelist](https://tailwindcss.com/docs/content-configuration#safelisting-classes) it.

### standalone

```tsx
import { twyx } from "twyx";

const classes = twyx({
  borderColor: "red-500",
  borderStyle: { _: "solid", md: "dashed", dark: { _: "dashed", md: "solid" } },
  borderWidth: 1,
})();

// out:
// classes === "border border-solid md:border-dashed dark:border-dashed md:dark:border-solid border-red-500"
```

### react

```tsx
import { x } from 'twyx/react'

// in
<x.div as="p" borderWidth={1} borderStyle={{_: 'solid', md: 'dashed', dark: {_:'dashed', md:'solid'}}} borderColor="red-500" />

// out
<p className="border border-solid md:border-dashed dark:border-dashed md:dark:border-solid border-red-500" />
```

### extending twyx

If you add additional tailwind utility classes in your project and want them to be picked up by twyx autocomplete, you'll need to do perform a module augmentation like so:

```ts
declare module "twyx" {
  export namespace Twyx {
    type CustomColors = ColorProps<"indigo" | "chartreuse">;

    export interface PropValues extends ColorProps<BaseColors | BaseColorTransparencies>, CustomColors {
      aspectRatio: "my-custom-value";
    }
  }
}
```

Custom values will be appended to the original type.

### todo

- [x] write some tests
- [x] set up ci & changesets
- [ ] figure out if it's possible to hook up Tailwind's nice VS Code extension autocomplete directly to twyx
- [ ] website using astro (just wanna try it and see what's up)

---

Thank you very much to the Tailwind team for creating a fantastic framework. This library is meant to act as a bridge for those that prefer the CSS-way of referring to things.
