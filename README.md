# Denosh

Denosh is a command line tool solution for Deno.

## Installation

```bash
deno install --allow-read --allow-write -f -n denosh https://raw.githubusercontent.com/denosh/denosh/master/denosh.ts
```

***Cation: If you choose to use this way, you can just use bulltin commands, and it's not that useful** 

* `--allow-read` and `--allow-write`, this is the default permission needed, if your commands use more permission, you can add here, or just use `-A`.
* `-f` means override last install.
* `-n denosh` is for naming the installed executable binary.

## As a mod

```js
import { launch, registerCommand } from 'https://raw.githubusercontent.com/denosh/denosh/master/mod.ts'

import * as test1Command from './src/commands/test1.ts'
import * as **test2Command** from './src/commands/test2.ts'

registerCommand('test1', test1Command)
registerCommand('test2', test2Command)

if (import.meta.main) {
  launch(Deno.args, {
    scriptName: 'Your script name',
    commandDir: 'Command directory'
  })
}
```

## Add a command using generator

There is a built in command, called generate, it's very easy to generate a simple command structure, it use the `commandDir` in launch option to know where to write the command.

```
deno run cli.ts test3
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

## Dynamicly register commands

As I tried, I can not provide the api in my mod, because Deno prevent dynamicly import module out of a mod, so you need to create the dynamicly import and register api in your mod.

I write an example code about this below, feel free to change in your way:

```js
async function dynamicRegister() {
  const commandsDir = 'src/commands'
  const scannedCommands = []
  for (let entry of Deno.readDirSync(commandsDir)) {
    if (entry.isFile && path.extname(entry.name) == '.ts') {
      scannedCommands.push(entry)
    }
  }

  for (let entry of scannedCommands) {
    const command = await import(path.resolve(commandsDir, entry.name))
    registerCommand(path.basename(entry.name, '.ts'), command)
  }
}

await dynamicRegister()
```

## License

MIT