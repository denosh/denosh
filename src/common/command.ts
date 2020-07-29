import * as path from "https://deno.land/std/path/mod.ts"

import { CommandsStructure } from './interface.ts'
import { OptionManger } from './option.ts'
import * as Utils from './utils.ts'

import * as generateCommand from '../commands/generate.ts'

export function showVersion() {
  Utils.logger.info(Utils.VERSION)
}

export async function loadExtraCommands(loadedCommands: CommandsStructure) {
  const config = await Utils.getConfig()

  if (!config.commandDir) {
    return
  }

  const __dirname = path.dirname(path.fromFileUrl(import.meta.url))
  const coreCommandsDir: string = path.resolve(__dirname, '../commands')
  const commandsDir: string = path.resolve(Deno.cwd(), config.commandDir)

  if (coreCommandsDir === commandsDir) {
    return
  }

  const scannedCommands = []
  for (let entry of Deno.readDirSync(commandsDir)) {
    if (entry.isFile && path.extname(entry.name) == '.ts') {
      scannedCommands.push(entry)
    }
  }

  for (let entry of scannedCommands) {
    const command = await import(path.resolve(commandsDir, entry.name))
    loadedCommands[path.basename(entry.name, '.ts')] = command
  }
}

export async function loadCoreCommands(): Promise<CommandsStructure> {
  // Loaded all commands
  const loadedCommands: CommandsStructure = {}
  loadedCommands.version = {
    name: 'version',
    desc: 'Show version',
  }
  loadedCommands.help = {
    name: 'help',
    desc: 'Show help',
  }

  loadedCommands.generate = generateCommand

  return loadedCommands
}

export function showHelp(commandName: string, loadedCommands : CommandsStructure) {
  const scriptName = 'denosh'
  if (commandName === 'help') {

    Utils.logger.info(`${scriptName} [command]`)
    
    if (Object.keys(loadedCommands).length > 0) {
      console.log()
      Utils.logger.info('Commands:')
      Object.keys(loadedCommands).forEach(commandName => {
        const command = loadedCommands[commandName]
        let commandText = `  ${scriptName} ${command.name}`
        if (command.desc) {
          commandText = commandText.padEnd(40, ' ') + command.desc
        }
        Utils.logger.info(commandText)
      })
    }

    console.log()
    Utils.logger.info('Options:')
    Utils.logger.info('  -h, --help: Show help')
    Utils.logger.info('  -v, --version: Show version')

  }
  else {
    if (loadedCommands[commandName]) {
      const command = loadedCommands[commandName]

      Utils.logger.info(command.name)
      console.log()
      Utils.logger.info(command.desc)

      const optionManger = new OptionManger()
      command.builder && command.builder(optionManger)

      if (optionManger.keys().length > 0) {
        console.log()
        Utils.logger.info('Options:')

        
        optionManger.keys().forEach(key => {
          const option = optionManger.get(key)
          const options = [key]
          if (option.alias) {
            options.push(option.alias)
          }

          const optionsText = options.map((o) => {
            if (o.length > 1) {
              return '--' + o
            }
            return '-' + o
          }).join(', ')

          Utils.logger.info('  ' + optionsText.padEnd(20, ' ') + option.desc)
        })
      }
      
    }
    else {
      Utils.logger.error('Command not found')
      Deno.exit(1)
    }
  }
}