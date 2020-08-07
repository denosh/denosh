import * as path from "https://deno.land/std/path/mod.ts";
import { OptionManagerInterface } from "../common/interface.ts";

export const name = "generate <name> [desc]";
export const desc = "Generate command";
export const aliases = "g";

type Argv = {
  name: string;
  desc?: string;
  commandDir?: string;
};

export const builder = (option: OptionManagerInterface) => {};

export const handler = async (argv: Argv) => {
  if (!argv.commandDir) {
    throw new Error("opts.commandDir not defined.");
  }

  argv.desc = argv.desc || argv.name;

  const code = `export const name = '${argv.name}'
export const desc = '${argv.desc}'
export const aliases = ''

export const builder = (option: any) => {}

export const handler = async (argv: any) => {
  console.log('Hello world!')
}
`;
  Deno.writeTextFileSync(
    path.resolve(Deno.cwd(), argv.commandDir, argv.name + ".ts"),
    code,
  );
  console.log("Done!");
};
