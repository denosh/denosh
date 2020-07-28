import { OptionMangerInterface, OptionStructure, OptionsStructure } from './interface.ts'

export class OptionManger implements OptionMangerInterface {
  mapping: OptionsStructure = {}

  constructor() {}

  set(key: string, value: OptionStructure) {
    this.mapping[key] = value
  }

  get(key: string): OptionStructure {
    return this.mapping[key]
  }

  all(): OptionsStructure {
    return this.mapping
  }

  keys(): string[] {
    return Object.keys(this.mapping) || []
  }

}