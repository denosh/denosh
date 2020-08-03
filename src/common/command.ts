import { parse } from "https://deno.land/std/flags/mod.ts";
import {
  CommandsStructure,
  LaunchOptionStructure,
  CommandStructure,
  AliasCommandMapping,
} from "./interface.ts";
import { OptionManger } from "./option.ts";
import * as Utils from "./utils.ts";

import * as generateCommand from "../commands/generate.ts";

const commands: CommandsStructure = {};

export function registerCommand(
  commandName: string,
  command: CommandStructure,
) {
  commands[commandName] = command;
}

export async function launch(args: string[], opts: LaunchOptionStructure = {}) {
  // Process options
  const argv = parse(args);
  let {
    _: [commandName],
  } = argv;

  const loadedCommands = await loadCoreCommands();
  await loadExtraCommands(loadedCommands, opts);

  // Process command alias
  const aliases: AliasCommandMapping = {};
  Object.keys(loadedCommands).forEach((command) => {
    if (Array.isArray(loadedCommands[command].aliases)) {
      let commandAlias = <string[]> loadedCommands[command].aliases;
      commandAlias.forEach((alias) => {
        aliases[alias] = command;
      });
    } else if (loadedCommands[command].aliases) {
      aliases[<string> loadedCommands[command].aliases] = command;
    }
  });

  if (!commandName) {
    commandName = "help";
  }

  // Transfar alias to full command name
  if (aliases[commandName]) {
    commandName = aliases[commandName];
    argv._[0] = commandName;
  }

  if (argv.version || argv.v || commandName === "version") {
    showVersion();
    return;
  }

  if (argv.help || argv.h || commandName === "help") {
    showHelp(loadedCommands, <string> commandName, opts);
    return;
  }

  if (loadedCommands[commandName]) {
    try {
      const command = loadedCommands[commandName];
      const parsed = Utils.parseCommandName(command.name, argv._.join(" "));

      if (command.handler) {
        await command.handler(Object.assign({}, parsed, argv, opts));
      }
    } catch (e) {
      Utils.logger.error(e.message);
    }
  } else {
    Utils.logger.error("Command not found");
    Deno.exit(1);
  }
}

export function showVersion() {
  Utils.logger.info(Utils.VERSION);
}

export async function loadExtraCommands(
  loadedCommands: CommandsStructure,
  opts: LaunchOptionStructure,
) {
  Object.keys(commands).forEach((command) => {
    loadedCommands[command] = commands[command];
  });
}

export async function loadCoreCommands(): Promise<CommandsStructure> {
  // Loaded all commands
  const loadedCommands: CommandsStructure = {};
  loadedCommands.help = {
    name: "help",
    desc: "Show help",
  };
  loadedCommands.version = {
    name: "version",
    desc: "Show version",
  };

  loadedCommands.generate = generateCommand;

  return loadedCommands;
}

export function showHelp(
  loadedCommands: CommandsStructure,
  commandName: string,
  opts: LaunchOptionStructure = {},
) {
  const scriptName = opts.scriptName ? opts.scriptName : "denosh";
  if (commandName === "help") {
    Utils.logger.info(`${scriptName} [command]`);

    if (Object.keys(loadedCommands).length > 0) {
      console.log();
      Utils.logger.info("Commands:");
      Object.keys(loadedCommands).forEach((commandName) => {
        const command = loadedCommands[commandName];
        let commandText = `  ${scriptName} ${command.name}`;
        if (command.desc) {
          commandText = commandText.padEnd(40, " ") + command.desc;
        }

        const aliases = Array.isArray(command.aliases)
          ? command.aliases
          : command.aliases
          ? [command.aliases]
          : [];
        if (aliases.length > 0) {
          commandText = commandText.padEnd(80, " ") + "[alias: " +
            aliases.join(", ") + "]";
        }
        Utils.logger.info(commandText);
      });
    }

    console.log();
    Utils.logger.info("Options:");
    Utils.logger.info("  -h, --help: Show help");
    Utils.logger.info("  -v, --version: Show version");
  } else {
    if (loadedCommands[commandName]) {
      const command = loadedCommands[commandName];

      Utils.logger.info(command.name);
      console.log();
      Utils.logger.info(command.desc);

      const optionManger = new OptionManger();
      command.builder && command.builder(optionManger);

      if (optionManger.keys().length > 0) {
        console.log();
        Utils.logger.info("Options:");

        optionManger.keys().forEach((key) => {
          const option = optionManger.get(key);
          const options = [key];
          if (option.alias) {
            options.push(option.alias);
          }

          const optionsText = options.map((o) => {
            if (o.length > 1) {
              return "--" + o;
            }
            return "-" + o;
          }).join(", ");

          Utils.logger.info("  " + optionsText.padEnd(20, " ") + option.desc);
        });
      }
    } else {
      Utils.logger.error("Command not found");
      Deno.exit(1);
    }
  }
}
