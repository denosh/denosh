import * as path from "https://deno.land/std/path/mod.ts";
import { parse } from "https://deno.land/std/flags/mod.ts";
import {
  CommandsStructure,
  LaunchOptionStructure,
  CommandStructure,
  AliasCommandMapping,
  AliasOptionMapping,
} from "./interface.ts";
import { OptionManager } from "./option.ts";
import * as Utils from "./utils.ts";

import * as generateCommand from "../commands/generate.ts";

const commands: CommandsStructure = {};

async function dynamicRegister(commandsDir: string) {
  const scannedCommands = [];
  for (let entry of Deno.readDirSync(commandsDir)) {
    if (entry.isFile && path.extname(entry.name) == ".ts") {
      scannedCommands.push(entry);
    }
  }

  for (let entry of scannedCommands) {
    const command = await import(path.resolve(commandsDir, entry.name));
    registerCommand(path.basename(entry.name, ".ts"), command);
  }
}

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

  let loadedCommands = await loadCoreCommands();
  loadedCommands = await loadMoreCommands(loadedCommands, opts);

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

  if (argv.help || argv.h || argv._[argv._.length - 1] === "help") {
    showHelp(loadedCommands, <string> commandName, opts);
    return;
  }

  if (loadedCommands[commandName]) {
    try {
      const command = loadedCommands[commandName];

      // Process option alias
      const optionManager = new OptionManager();
      command.builder && command.builder(optionManager);
      const optionsAliasMapping: AliasOptionMapping = {};
      optionManager.keys().forEach((key) => {
        const option = optionManager.get(key);
        if (option.alias) {
          optionsAliasMapping[option.alias] = key;
        }

        if (!argv[key] && option.default) {
          argv[key] = option.default;
        }
      });

      for (let argKey in argv) {
        if (argKey === "_") continue;
        if (optionsAliasMapping[argKey]) {
          argv[optionsAliasMapping[argKey]] = argv[argKey];
        }
      }

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

export async function loadMoreCommands(
  loadedCommands: CommandsStructure,
  opts: LaunchOptionStructure,
): Promise<CommandsStructure> {
  Object.keys(commands).forEach((command) => {
    loadedCommands[command] = commands[command];
  });

  if (opts.exclude && opts.exclude.length > 0) {
    const filteredCommands: CommandsStructure = {};
    Object.keys(loadedCommands).forEach((command) => {
      if (opts.exclude && !opts.exclude.includes(command)) {
        filteredCommands[command] = loadedCommands[command];
      }
    });
    loadedCommands = filteredCommands;
  }

  return loadedCommands;
}

export async function loadCoreCommands(): Promise<CommandsStructure> {
  // Loaded fake commands
  const loadedCommands: CommandsStructure = {};
  loadedCommands.help = {
    name: "help",
    desc: "Show help",
  };
  loadedCommands.version = {
    name: "version",
    desc: "Show version",
  };

  // Load core commands
  registerCommand("generate", generateCommand);

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

      const optionManager = new OptionManager();
      command.builder && command.builder(optionManager);

      if (optionManager.keys().length > 0) {
        console.log();
        Utils.logger.info("Options:");

        optionManager.keys().forEach((key) => {
          const option = optionManager.get(key);
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
