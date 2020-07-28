import {
  assertThrows,
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts"

import * as Utils from '../src/common/utils.ts'

Deno.test('Utils.parseCommandName', () => {
  const parsed = Utils.parseCommandName('cmd <arg1> [arg2]', 'cmd foo bar')
  assertEquals(parsed, { arg1: "foo", arg2: "bar" })
  assertThrows(() => {
    Utils.parseCommandName('cmd <arg1> [arg2]', 'cmd')
  })
})