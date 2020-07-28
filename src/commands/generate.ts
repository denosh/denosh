import * as Utils from '../common/utils.ts'
import * as path from "https://deno.land/std/path/mod.ts"
import { OptionMangerInterface } from '../common/interface.ts'

export const name = 'generate <name> [desc]'
export const desc = 'Generate command'


type Argv = {
  name: string
  desc?: string
}

export const builder = (option: OptionMangerInterface) => {}

export const handler = async (argv: Argv) => {
  argv.desc = argv.desc || argv.name

  const code = `import { OptionMangerInterface } from '../common/interface.ts'

export const name = '${argv.name}'
export const desc = '${argv.desc}'
export const aliases = ''

export const builder = (option: OptionMangerInterface) => {}

export const handler = async (argv: any) => {
  console.log('Hello world!')
}
`
  const config = await Utils.getConfig()

  Deno.writeTextFileSync(path.resolve(Deno.cwd(), config.commandDir, argv.name + '.ts'), code)
  console.log('Done!')
}