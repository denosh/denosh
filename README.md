# Denosh

Denosh is a command line tool solution for Deno.

## Installation

```bash
deno install --unstable --allow-read --allow-write -f -n denosh https://raw.githubusercontent.com/denosh/denosh/master/denosh.ts
```

***Cation: If you choose to use this way, you can just use bulltin commands, and it's not that useful** 

* `--unstable` is because that I use `std/fs` mod.
* `--allow-read` and `--allow-write`, this is the default permission needed, if your commands use more permission, you can add here, or just use `-A`.
* `-f` means override last install.
* `-n denosh` is for naming the installed executable binary.

## As a mod

```js
import { launch, registerCommand } from 'https://raw.githubusercontent.com/denosh/denosh/master/mod.ts'

import * as test1Command from './src/commands/test1.ts'
import * as test2Command from './src/commands/test2.ts'

if (import.meta.main) {
  launch(Deno.args, {
    scriptName: 'Your script name',
    commandDir: 'Command directory'
  })
}
```

## Command structure

```js
export const name = 'test'
export const desc = 'test'
export const aliases = ''

export const builder = (option: any) => {
  Option.set('opt1', { desc: 'opt1 desc', default: 'val1', alias: 'o1'})
}

export const handler = async (argv: any) => {
  console.log('Hello world!')
}
```

## License

MIT