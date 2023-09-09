# twyx

an attempt to map xstyled's syntax to tailwind equivalents and expose this functionality as components

## install

```sh
bun install twyx
```

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

```tsx
import { x } from 'twyx/react'

// in
<x.div as="p" borderWidth={1} borderStyle={{_: 'solid', md: 'dashed', dark: {_:'dashed', md:'solid'}}} borderColor="red-500" />

// out
<p className="border border-solid md:border-dashed dark:border-dashed md:dark:border-solid border-red-500" />
```
