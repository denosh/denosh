export type OptionStructure = {
  /** Option description */
  desc: string;

  /** Option alias, not working for now */
  alias?: string;

  /** Option default value, not working for now */
  default?: string;
};

export type OptionsStructure = {
  [key: string]: OptionStructure;
};

export interface OptionMangerInterface {
  /** Set option */
  set(key: string, value: OptionStructure): void;

  /** Get option */
  get(key: string): OptionStructure;

  /** Get all options */
  all(): OptionsStructure;

  /** Get all keys of options */
  keys(): string[];
}

export type CommandStructure = {
  /** Command name */
  name: string;

  /** Command description */
  desc: string;

  /** Command option builder */
  builder?(option: OptionMangerInterface): void;

  /** Command handler */
  handler?(argv: NormalArgvStructure): void;

  /** alias, for now it's not working */
  aliases?: string | string[];
};

export type CommandsStructure = {
  [key: string]: Writable<CommandStructure>;
};

export type ConfigStructure = {
  [key: string]: string | number | boolean | undefined;
};

export type MatchStructure = {
  [key: string]: string | number | boolean | undefined;
};

export type NormalArgvStructure = {
  [key: string]: string | number | boolean | undefined;
};

export type AliasCommandMapping = {
  [key: string]: string;
};

export type AliasOptionMapping = {
  [key: string]: string;
};

export type NormalObjectStructure = {
  [key: string]: string | number | boolean | undefined;
};

export type LaunchOptionStructure = {
  /** entry script name, used in showing help info */
  scriptName?: string;

  /** Extra Commands Directory */
  commandDir?: string;
};

export type Writable<T> = {
  -readonly [K in keyof T]: T[K];
};
