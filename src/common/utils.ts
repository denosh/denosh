import { Logger } from "https://deno.land/x/deno_util/logger.ts"
import * as path from "https://deno.land/std/path/mod.ts"
import { existsSync } from "https://deno.land/std/fs/mod.ts"

import { ConfigStructure } from './interface.ts'

export const VERSION = '0.0.1'

export const logger = new Logger()

export async function getConfig(): Promise<ConfigStructure> {
  // @ts-ignore
  let config = {}
  console.log(path.resolve('./.denoshrc.ts'))
  console.log(path.resolve('./.denoshrc.ts'))
  console.log(await import(path.resolve('./.denoshrc.ts')))
  Deno.chdir(Deno.cwd())
  if (existsSync(path.resolve('./.denoshrc.ts'))) {
    config = await import('file://' + path.resolve('./.denoshrc.ts'))
  }
  return config
}

export const parseCommandName = (commandName: string, target: string) => {
  commandName = commandName.replace(/\s{2,}/g, ' ')
  target = target.replace(/\s{2,}/g, ' ')
  const commandNamePattern = commandName
    .replace(' <', '(?<').replace('>', '> \\w+)?')
    .replace(' [', '(?<').replace(']', '> \\w+)?')

  const commandGroupPattern = commandName
    .replace(/<.*?>/, '(\\S+)')
    .replace(/\[.*?\]/, '(\\S+)')

  const regexp1 = new RegExp(commandNamePattern)
  const match1: any = regexp1.exec(target)

  const regexp2 = new RegExp(commandGroupPattern)
  const match2: any = regexp2.exec(commandName)

  const commandArgs: any = {}
  match2.forEach((value: string, key: number) => {
    if (key === 0) {
      return
    }

    if (value.indexOf('<') > -1 && !match1[key]) {
      throw new Error(`${value} is required`)
    }

    value = value.replace(/[<>\[\]]/g, '')
    commandArgs[value] = match1[key] ? match1[key].trim() : undefined
  })

  return commandArgs
}

