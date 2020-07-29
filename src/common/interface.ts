export type OptionStructure = {
  /** Option description */
  desc: string

  /** Option alias, not working for now */
  alias?: string

  /** Option default value, not working for now */
  default?: string
}

export type OptionsStructure = {
  [key: string]: OptionStructure
}

export interface OptionMangerInterface {
  /** Set option */
  set(key: string, value: OptionStructure): void

  /** Get option */
  get(key: string): OptionStructure

  /** Get all options */
  all(): OptionsStructure

  /** Get all keys of options */
  keys(): string[]
}

export type CommandStructure = {
  /** Command name */
  name: string

  /** Command description */
  desc: string

  /** Command option builder */
  builder?(option: OptionMangerInterface): void

  /** Command handler */
  handler?(argv: NormalArgvStructure): void

  /** alias, for now it's not working */
  aliases?: string | string[]
}

export type CommandsStructure = {
  [key: string]: CommandStructure
}

export type ConfigStructure = {
  [key: string]: any
}

export type NormalArgvStructure = {
  [key: string]: any
}

export type LaunchOptionStructure = {
  /** entry script name, used in showing help info */
  scriptName?: string

  /** Extra Commands Directory */
  commandDir?: string
}