# NeTEx deckplan library

TypeScript library for working with NeTEx deckplans. Uses Bun.

## Setup

Install [Bun](https://bun.com/docs/installation), then run:

```sh
cd library
bun install
```

## Development

```sh
bun run typecheck  # Check TypeScript types
bun run build      # Generate JavaScript and declarations in dist/
bun run dev        # Watch files and rebuild when changes are applied
```

The public entry point is `src/library.ts`.