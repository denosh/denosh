# Denosh

Denosh is a command line tool solution for Deno.

## Installation

```bash
deno install --unstable --allow-read --allow-write -f -n denosh https://raw.githubusercontent.com/denosh/denosh/master/denosh.ts
```

* `--unstable` is because that I use `std/fs` mod.
* `--allow-read` and `--allow-write`, this is the default permission needed, if your commands use more permission, you can add here, or just use `-A`.
* `-f` means override last install.
* `-n denosh` is for naming the installed executable binary.

## As a mod

```js
import { OptionMangerInterface } from 'https://raw.githubusercontent.com/denosh/denosh/master/mod.ts'
```

Tips: If you use this as mod, you should add `--allow-net` when installing

## License

MIT