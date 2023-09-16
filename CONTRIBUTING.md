# contributing to twyx

First, thank you! Contributors are what make open source go 'round, so your interest is very appreciated.

## installation

1. ensure `bun` [is installed](https://bun.sh/)
2. `bun install`

## adding a framework adapter

twyx is designed as both a core standalone library and with third-party framework adapters like `twyx/react`.

To add an adapter for a new framework:

1. create an appropriately-named file in the `src` directory and integrate `twyx` using the best practices of your framework.
2. try to limit installed packages to the bare minimum
3. add an entry to `package.json "exports"` for the new file
4. add the file to the `compile:lib` script target
5. add the file to `tsconfig.json "include"`
6. add a section to the README
