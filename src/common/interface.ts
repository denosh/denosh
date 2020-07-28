export type OptionStructure = {
  desc: string
  alias?: string
  default?: string
}

export type OptionsStructure = {
  [key: string]: OptionStructure
}

export interface OptionMangerInterface {
  set(key: string, value: OptionStructure): void
  get(key: string): any
  all(): OptionsStructure
  keys(): string[]
}

export type CommandStructure = {
  name: string
  desc: string
  builder?(option: OptionMangerInterface): void
  handler?(argv: any): void
  aliases?: string | string[]
}

export type CommandsStructure = {
  [key: string]: CommandStructure
}

export type ConfigStructure = {
  [key: string]: any
}