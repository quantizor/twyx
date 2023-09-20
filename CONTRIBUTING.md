# contributing to twyx

First, thank you! Contributors are what make open source go 'round, so your interest is very appreciated.

## code of conduct

1. Don't be a jerk.
2. If a PR exists already to do what you're trying to accomplish, please ask to help with the existing one vs just making another one (unless the original is long-abandoned and the contributor is not responsive.)
3. Patience is a virtue; open source maintainers have full-time jobs and lives, sometimes things take time.

## installation

1. ensure `bun` [is installed](https://bun.sh/)
2. `bun install`

## commits

Please use [semantic commit style](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716) for commit titles, e.g. `chore: something`, `fix: something`, `feat: something`.

## write a changeset

twyx uses changesets to manage releases and produce a helpful and easy-to-scan changelog. Use `bun changeset` to craft one to be added to your PR. For reference:

- `major` is meant only for breaking changes (and to increment to 1.x from 0.x, denoting official library API stability)
- `minor` applies to new functionality (and typically during 0.x breaking changes may appear in minor releases)
- `patch` is everything else that affects the library code, including dependency bumps

When your PR containing a changeset is merged, it'll get automatically added to the next release. Releases occur every so often, thanks for your patience!

## adding support for a new css prop

As Tailwind itself evolves, it's likely that new utility classes will be added to the base set corresponding to new CSS properties. Adding new properties to `twyx` involves going into `src/core.ts` and adding to two spots:

### `PropValues` interface

`PropValues` defines all the props that twyx can accept and what values it accepts. In order to keep the library size very small and performant, we don't stray at all outside of what Tailwind itself accepts and attempt to find the patterns in the classes. For example:

When thinking about [`backgroundSize`](https://tailwindcss.com/docs/background-size) in Tailwind, there are currently three styles and associated classes:

| class      | properties                  |
| ---------- | --------------------------- |
| bg-auto    | `background-size: auto;`    |
| bg-cover   | `background-size: cover;`   |
| bg-contain | `background-size: contain;` |

This one ends up being pretty easy because all the classes are 1:1; they all share a `bg` prefix and the value is the same between the class and the real property value.

For this example, the corresponding `PropValues` KV pair would be:

```ts
{
  backgroundSize: "auto" | "cover" | "contain" | ArbitraryValue;
}
```

`ArbitraryValue` is a type inside the twyx namespace that corresponds to the `[customValue]` syntax that is permitted for many tailwind classes. You can always see if this is allowed on the Tailwind style documentation page.

### `transforms` object

The runtime code that implements what we did in `PropValues` is the `transforms` object.

For the previous example, we can synthesize a transformer by utilizing the `branch` helper function as-so:

```ts
{
  backgroundSize: branch("bg"),
}
```

The `branch` function does a few things:

- It accepts a `partial` as the first argument, which correponds to the shared prefix for tailwind classes (if there is one, see the next example for other situations.)
- It accepts an optional second argument which allows you to take full control over the tailwind class that will be emitted. More on that below.
- It internally handles if a custom value is provided (`[something]`), following the typical tailwind pattern of applying the custom value to the given partial, e.g. `bg-[50%]`

Simple right? This is the happy-path scenario. There are properties with more complexity, and the next example will demo how to deal with that.

### complex tailwind class structures

Not every tailwind styling target is as straightforward as `backgroundSize`. For example, [`resize`](https://tailwindcss.com/docs/resize) looks like this:

| class       | properties            |
| ----------- | --------------------- |
| resize-none | `resize: none;`       |
| resize-y    | `resize: vertical;`   |
| resize-x    | `resize: horizontal;` |
| resize      | `resize: both;`       |

Specifically, notice how the class for `resize: both;` has no suffix? In scenarios like this we have to make some architectural choices that optimize for both developer experience and library size.

The corresponding `PropValues` KV pair looks like this:

```ts
{
  resize: "none" | "y" | "x" | "both";
}
```

There are two immediate differences from the first example:

1. `ArbitraryValue` is not added, because it's not present in the [Tailwind doc page](https://tailwindcss.com/docs/resize) for that style
2. Naked keys without corresponding values don't really make sense for this library, so we'll instead choose to swap in `"both"` to represent the no-suffix case

This is then reflected in the `transforms` entry:

```ts
{
  resize: branch("resize", (v, p) => (v === "both" ? p : `${p}-${v}`)),
}
```

Because we've constrained the `PropValues` interface to the values that tailwind wants (not the _actual_ CSS value), plus `"both"` for the base case, the second argument to `branch` ends up being a simple check if the value `v` is `"both"` (supplying the partial `p` by itself as the table indicates) and otherwise falls back to just appending the value to the given partial `p`.

To have a small library you have to be clever, if we encoded all the real CSS values the bundle weight would be a good bit heavier.

Final note here, for styles that accept numeric values we prefer to allow both the raw number and the stringified number `PropValues`. There's a `Stringify` helper type to handle this and you can see an example in `fontWeight`.

## adding a framework adapter

twyx is designed as both a core standalone library and with third-party framework adapters like `twyx/react`.

To add an adapter for a new framework:

1. create an appropriately-named file in the `src` directory and integrate `twyx` using the best practices of your framework.
2. try to limit installed packages to the bare minimum
3. add an entry to `package.json "exports"` for the new file
4. add the file to the `compile:lib` script target
5. add the file to `tsconfig.json "include"`
6. add a section to the README

## get credit

If you've contributed a new feature or framework adapter to twyx, it's highly encouraged to add yourself to [`package.json "contributors"`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#people-fields-author-contributors) (and thank you!)
