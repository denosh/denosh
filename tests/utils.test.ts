import {
  assertThrows,
  assertEquals,
} from "https://deno.land/std/testing/asserts.ts"

import * as Utils from '../src/common/utils.ts'

Deno.test('Utils.parseCommandName', () => {
  const parsed1 = Utils.parseCommandName('cmd <arg1> [arg2]', 'cmd foo bar')
  assertEquals(parsed1, { arg1: "foo", arg2: "bar" })
  const parsed2 = Utils.parseCommandName('cmd  <arg1>  [arg2]', 'cmd foo bar')
  assertEquals(parsed2, { arg1: "foo", arg2: "bar" })
  assertThrows(() => {
    Utils.parseCommandName('cmd <arg1> [arg2]', 'cmd')
  })
})