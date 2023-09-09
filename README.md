# twyx

an attempt to map xstyled's syntax to tailwind equivalents and expose this functionality as components

```tsx
import { x } from 'twyx/react'

// in
<x.div borderWidth={1} borderStyle={{_: 'solid', md: 'dashed', dark: {_:'dashed', md:'solid'}}} borderColor="red-500" />

// out
<div className="border border-solid md:border-dashed dark:border-dashed md:dark:border-solid border-red-500">
```
