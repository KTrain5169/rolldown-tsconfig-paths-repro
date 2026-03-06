# Rolldown TSConfig `references` and `paths` bug reproduction

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/KTrain5169/rolldown-tsconfig-paths-minimal-repro)
[![Open in Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https:///pr.new/KTrain5169/rolldown-tsconfig-paths-minimal-repro)

## Context

`references` and `paths` issue:

- The `paths` tsconfig option is used to define import resolution aliases for TypeScript, as well as bundlers that support the option.
- `references` can be used to separate a repo into multiple "projects" that can be used for incremental rebuild in TypeScript, allowing separation of configurations for each part of the repo and in general keeping things sane.
- According to [issue #7177 on the Rolldown repo](https://github.com/rolldown/rolldown/issues/7177), this issue has been fixed and Rolldown can resolve it correctly, however this repo (running Rolldown v1.0.0-rc.7) still reproduces the issue.

`react/jsx-runtime` issue:

- The `jsx` option controls how JSX constructs are emitted from TSX files to JS files. This repo uses `react-jsx`, but the issue happens whether `jsx` is set to `react-jsx` or `react-jsxdev` (other options disallow using the `jsxImportSource` config).
- The `jsxImportSource` option controls which module specifier for JSX factory functions if the `jsx` option is set to `react-jsx` or `react-jsxdev`. This repo uses Preact (therefore setting this option to `preact`), but Rolldown appears to be searching for `react/jsx-runtime` regardless.

## System information

(Info obtained from `pnpx envinfo --system --npmPackages rolldown --binaries --browsers`)

```bash
  System:
    OS: Windows 11 10.0.26200
    CPU: (12) x64 13th Gen Intel(R) Core(TM) i5-1334U
    Memory: 1.67 GB / 15.69 GB
  Binaries:
    Node: 22.14.0 - C:\Program Files\nodejs\node.EXE
    npm: 11.7.0 - C:\Program Files\nodejs\npm.CMD
    pnpm: 10.30.0 - C:\Users\KT\AppData\Local\pnpm\pnpm.CMD
    bun: 1.3.3 - C:\Users\KT\.bun\bin\bun.EXE
  Browsers:
    Chrome: 145.0.7632.159
    Edge: Chromium (140.0.3485.54)
    Firefox: 148.0 - C:\Program Files\Mozilla Firefox\firefox.exe
  npmPackages:
    rolldown: 1.0.0-rc.7 => 1.0.0-rc.7
```

## Reproduction steps

Run the following commands after opening:

1. `pnpm install --frozen-lockfile`
2. `pnpm rolldown -c`

Expected behaviour: No warning, and Rolldown resolves aliased paths correctly.

Actual behaviour: observe the following `[UNRESOLVED_IMPORT]` warnings in the terminal.

```bash
app\index.tsx (1:26) [UNRESOLVED_IMPORT] Warning: Could not resolve '1/index' in app/index.ts
   ╭─[ app/index.tsx:1:27 ]
   │
 1 │ import { function1 } from "1/index";
   │                           ────┬────
   │                               ╰────── Module not found, treating it as an external dependency
───╯

[UNRESOLVED_IMPORT] Warning: Could not resolve 'react/jsx-runtime' in app/index.tsx

server\index.ts (1:26) [UNRESOLVED_IMPORT] Warning: Could not resolve '2/index' in server/index.ts
   ╭─[ server/index.ts:1:27 ]
   │
 1 │ import { function2 } from "2/index";
   │                           ────┬────
   │                               ╰────── Module not found, treating it as an external dependency
───╯

<DIR>/app.js  chunk │ size: 0.09 kB
<DIR>/server.js  chunk │ size: 0.09 kB
```
