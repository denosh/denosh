import { launch } from './src/common/command.ts'

if (import.meta.main) {
  launch(Deno.args, {
    scriptName: 'denosh',
    commandDir: 'src/commands'
  })
}