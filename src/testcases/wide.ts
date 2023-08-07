import type { TestCase } from "../types.js";
import * as z from "zod";
import * as v from "valibot";

export default {
  name: "wide",
  data: [
    {
      name: "valid",
      expected: { success: true },
      data: {
        a: { x: "" },
        b: { x: "" },
        c: { x: "" },
        d: { x: "" },
        e: { x: "" },
        f: { x: "" },
        g: { x: "" },
        h: { x: "" },
        i: { x: "" },
        j: { x: "" },
        k: { x: "" },
        l: { x: "" },
        m: { x: "" },
        n: { x: "" },
        o: { x: "" },
        p: { x: "" },
        q: { x: "" },
        r: { x: "" },
        s: { x: "" },
        t: { x: "" },
        u: { x: "" },
        v: { x: "" },
        w: { x: "" },
        x: { x: "" },
        y: { x: "" },
        z: { x: "" },
      },
    },
    {
      name: "invalid",
      expected: { success: false, issuesCount: 26 },
      data: {
        a: { x: 0 },
        b: { x: 0 },
        c: { x: 0 },
        d: { x: 0 },
        e: { x: 0 },
        f: { x: 0 },
        g: { x: 0 },
        h: { x: 0 },
        i: { x: 0 },
        j: { x: 0 },
        k: { x: 0 },
        l: { x: 0 },
        m: { x: 0 },
        n: { x: 0 },
        o: { x: 0 },
        p: { x: 0 },
        q: { x: 0 },
        r: { x: 0 },
        s: { x: 0 },
        t: { x: 0 },
        u: { x: 0 },
        v: { x: 0 },
        w: { x: 0 },
        x: { x: 0 },
        y: { x: 0 },
        z: { x: 0 },
      },
    },
  ],
  schema: {
    valibot: v.object({
      a: v.object({
        x: v.string(),
      }),
      b: v.object({
        x: v.string(),
      }),
      c: v.object({
        x: v.string(),
      }),
      d: v.object({
        x: v.string(),
      }),
      e: v.object({
        x: v.string(),
      }),
      f: v.object({
        x: v.string(),
      }),
      g: v.object({
        x: v.string(),
      }),
      h: v.object({
        x: v.string(),
      }),
      i: v.object({
        x: v.string(),
      }),
      j: v.object({
        x: v.string(),
      }),
      k: v.object({
        x: v.string(),
      }),
      l: v.object({
        x: v.string(),
      }),
      m: v.object({
        x: v.string(),
      }),
      n: v.object({
        x: v.string(),
      }),
      o: v.object({
        x: v.string(),
      }),
      p: v.object({
        x: v.string(),
      }),
      q: v.object({
        x: v.string(),
      }),
      r: v.object({
        x: v.string(),
      }),
      s: v.object({
        x: v.string(),
      }),
      t: v.object({
        x: v.string(),
      }),
      u: v.object({
        x: v.string(),
      }),
      v: v.object({
        x: v.string(),
      }),
      w: v.object({
        x: v.string(),
      }),
      x: v.object({
        x: v.string(),
      }),
      y: v.object({
        x: v.string(),
      }),
      z: v.object({
        x: v.string(),
      }),
    }),
    zod: z.object({
      a: z.object({
        x: z.string(),
      }),
      b: z.object({
        x: z.string(),
      }),
      c: z.object({
        x: z.string(),
      }),
      d: z.object({
        x: z.string(),
      }),
      e: z.object({
        x: z.string(),
      }),
      f: z.object({
        x: z.string(),
      }),
      g: z.object({
        x: z.string(),
      }),
      h: z.object({
        x: z.string(),
      }),
      i: z.object({
        x: z.string(),
      }),
      j: z.object({
        x: z.string(),
      }),
      k: z.object({
        x: z.string(),
      }),
      l: z.object({
        x: z.string(),
      }),
      m: z.object({
        x: z.string(),
      }),
      n: z.object({
        x: z.string(),
      }),
      o: z.object({
        x: z.string(),
      }),
      p: z.object({
        x: z.string(),
      }),
      q: z.object({
        x: z.string(),
      }),
      r: z.object({
        x: z.string(),
      }),
      s: z.object({
        x: z.string(),
      }),
      t: z.object({
        x: z.string(),
      }),
      u: z.object({
        x: z.string(),
      }),
      v: z.object({
        x: z.string(),
      }),
      w: z.object({
        x: z.string(),
      }),
      x: z.object({
        x: z.string(),
      }),
      y: z.object({
        x: z.string(),
      }),
      z: z.object({
        x: z.string(),
      }),
    }),
  },
} satisfies TestCase;
