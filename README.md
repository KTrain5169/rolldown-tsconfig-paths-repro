# Rolldown TSConfig `references` and `paths` bug reproduction

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/KTrain5169/rolldown-tsconfig-paths-minimal-repro)
[![Open in Codeflow](https://developer.stackblitz.com/img/open_in_codeflow.svg)](https:///pr.new/KTrain5169/rolldown-tsconfig-paths-minimal-repro)

## Context

The `paths` tsconfig option is used to define import resolution aliases for TypeScript, as well as bundlers that support the option.
`references` can be used to separate a repo into multiple "projects" that can be used for incremental rebuild in TypeScript, allowing separation of configurations for each part of the repo and in general keeping things sane.
According to [issue #7177 on the Rolldown repo](https://github.com/rolldown/rolldown/issues/7177), this issue has been fixed and Rolldown can resolve it correctly, however this repo (running Rolldown v1.0.0-rc.5) still reproduces the issue.

## System information

(Info obtained from `pnpx envinfo`)

- Package manager: `pnpm v10.30.0`
- JS runtime: `Node.js v22.14.0`
- OS: `Windows 11 10.0.26200`

## Reproduction steps

Run the following commands after opening:

1. `pnpm install --frozen-lockfile`
2. `pnpm rolldown -c`

Then, observe the `[UNRESOLVED_IMPORT]` warning in the terminal:

```bash
app\index.ts (1:26) [UNRESOLVED_IMPORT] Warning: Could not resolve '1/index' in app/index.ts
   ╭─[ app/index.ts:1:27 ]
   │
 1 │ import { function1 } from "1/index";
   │                           ────┬────
   │                               ╰────── Module not found, treating it as an external dependency
───╯

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
