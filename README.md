# twyx

**_tailwind for css people_**

twyx is an abstraction on top of [tailwind](https://tailwindcss.com/) that seeks to make the framework more approachable to those that grew up with and/or prefer CSS syntax. It maps real CSS properties with the classes they target in a tiny wrapper. For more info on library design and tradeoffs, see [CONTRIBUTING](./CONTRIBUTING.md).

### standalone

```tsx
import { twyx } from "twyx";

const classes = twyx(
  {
    borderColor: "red-500",
    borderStyle: { _: "solid", md: "dashed", dark: { _: "dashed", md: "solid" } },
    borderWidth: 1,
  },
  "additional classes here",
);

// out:
// classes === "border border-solid md:border-dashed dark:border-dashed md:dark:border-solid border-red-500 additional classes here"
```

### react

`twyx/react` supports the [polymorphic "as" prop](https://www.robinwieruch.de/react-as-prop/) for dynamic composition of element as well as styling.

You can use the `twyx` function directly with `className` in React or try the `x` primitives.

```tsx
import { twyx, x } from 'twyx/react'

// option 1: twyx function
<div
  className={twyx({
    borderColor: 'red-500',
    borderWidth: 1,
    borerStyle: {
      _:'solid',
      md: 'dashed',
      dark: {
        _: 'dashed',
        md: 'solid'
      },
    }
  }, 'other classes if desired')}
/>

// out
// <div className="border-red-500 border-solid md:border-dashed dark:border-dashed md:dark:border-solid other classes if desired" />

// option 2: x.* primitives
<x.div as="p" className="other classes if desired" borderColor="red-500" borderStyle={{_: 'solid', md: 'dashed', dark: {_:'dashed', md:'solid'}}} borderWidth={1} />

// out
// <p className="border-red-500 border-solid md:border-dashed dark:border-dashed md:dark:border-solid border other classes if desired" />
```

> _Why "x"?_ twyx was inspired by [xstyled](https://xstyled.dev/), a prop-contemporary focusing on the styled-components ecosystem. Great artists steal, h/t to @gregberge :bow:

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
      jsx: transformTwyxProps,
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
