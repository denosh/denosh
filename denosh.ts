import { parse } from "https://deno.land/std/flags/mod.ts"

import { showHelp, showVersion, loadCoreCommands, loadExtraCommands } from './src/common/command.ts'
import * as Utils from './src/common/utils.ts'

async function main(args: string[]) {
  // Process options
  const argv = parse(args)
  let {
    _: [ commandName ]
  } = argv

  const loadedCommands = await loadCoreCommands()
  await loadExtraCommands(loadedCommands)
  
  if (!commandName) {
    commandName = 'help'
  }

  if (argv.version || argv.v || commandName === 'version') {
    showVersion()
    return
  }

  if (argv.help || argv.h || commandName === 'help') {
    showHelp(<string>commandName, loadedCommands);
    return
  }

  if (loadedCommands[commandName]) {
    try {
      const command = loadedCommands[commandName]
      const parsed = Utils.parseCommandName(command.name, argv._.join(' '))

      // @ts-ignore
      if (command.handler) {
        await command.handler(Object.assign({}, parsed, argv))
      }
    } catch (e) {
      Utils.logger.error(e.message)
    }
  } else {
    Utils.logger.error('Command not found')
    Deno.exit(1)
  }

  
}

main(Deno.args)