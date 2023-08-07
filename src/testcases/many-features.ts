import * as z from "zod";
import * as v from "valibot";

import type { TestCase } from "../types.js";

export const validData = {
  one: [
    {
      items: [
        {
          val: 'hello',
          str: 'abc',
          num: 123,
        },
        {
          val: 'hello',
          str: 'abcd',
          num: 155,
        },
        {
          val: 'world',
          str: 'abc',
          num: 123,
        },
        {
          val: 'hello',
          str: 'abc',
          num: 199,
        }
      ]
    }
  ]
}

export const invalidData = {
  one: [
    {
      items: [
        {
          val: 'aaaaaaaaaaaaaaaa',
          str: 'bbbbbbbbbbbbbbbb',
          num: 9999999,
        }
      ]
    }
  ]
}

export default {
  name: "many-features",
  data: [
    {
      name: 'valid',
      expected: { success: true },
      data: validData,
    },
    {
      name: 'invalid',
      expected: { success: false, issuesCount: 3 },
      data: invalidData,
    },
  ],
  schema: {
    valibot: v.object({
      one: v.array(
        v.transform(v.object({
          items: v.array(
            v.object({
              val: v.optional(v.union([v.literal("hello"), v.literal("world")])),
              str: v.transform(
                v.string([v.minLength(2), v.maxLength(5)]),
                (a) => a + "_APPENDED",
              ),
              num: v.transform(
                v.number([v.minValue(100), v.maxValue(200)]),
                String
              ),
            }),
          ),
        }), o => ["FIRST", ...o.items])
      ),
    }),
    zod: z.object({
      one: z.array(
        (z.object({
          items: z.array(
            z.object({
              val: z.union([z.literal("hello"), z.literal("world")]).optional(),
              str:
                z.string().min(2).max(5).transform(a => a + "_APPENDED"),
              num:
                z.number().min(100).max(200).transform(String)
            }),
          ),
        })).transform(o => ["FIRST", ...o.items]),
      ),
    })
  },
} satisfies TestCase;
