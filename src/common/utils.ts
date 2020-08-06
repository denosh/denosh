import { Logger } from "https://deno.land/x/deno_util/logger.ts";
import { MatchStructure } from "./interface.ts";

export const VERSION = "0.0.4";
export const logger = new Logger();

export const parseCommandName = (commandName: string, target: string) => {
  commandName = commandName.replace(/\s{2,}/g, " ");
  target = target.replace(/\s{2,}/g, " ");
  const commandNamePattern = commandName
    .replace(" <", "(?<").replace(">", "> \\w+)?")
    .replace(" [", "(?<").replace("]", "> \\w+)?");

  const commandGroupPattern = commandName
    .replace(/<.*?>/, "(\\S+)")
    .replace(/\[.*?\]/, "(\\S+)");

  const regexp1 = new RegExp(commandNamePattern);
  const match1: string[] | null = regexp1.exec(target);

  const regexp2 = new RegExp(commandGroupPattern);
  const match2: string[] | null = regexp2.exec(commandName);

  const commandArgs: MatchStructure = {};
  if (match1 && match2) {
    match2.forEach((value: string, key: number) => {
      if (key === 0) {
        return;
      }

      if (value.indexOf("<") > -1 && !match1[key]) {
        throw new Error(`${value} is required`);
      }

      value = value.replace(/[<>\[\]]/g, "");
      commandArgs[value] = match1[key] ? match1[key].trim() : undefined;
    });
  }

  return commandArgs;
};
