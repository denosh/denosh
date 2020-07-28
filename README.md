# Denosh

Denosh is a command line tool solution for Deno.

## Installation

```bash
deno install --unstable -A -f -n denosh https://raw.githubusercontent.com/denosh/denosh/master/denosh.ts
```

* `--unstable` is because I use `std/fs` package.
* `-A` is for test, at least I use `--allow-read` and `--allow-write`, If your commands use more permission, you can add here, or just use `-A`.
* `-f` means override last install.
* `-n denosh` is for naming the installed executable binary.

## As a mod

```js
import { OptionMangerInterface } from 'https://raw.githubusercontent.com/denosh/denosh/master/mod.ts'
```