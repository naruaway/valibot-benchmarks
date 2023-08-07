import * as z from "zod";
import * as v from "valibot";
import type { TestCase } from "../types.js";

// from: https://github.com/colinhacks/zod/issues/205#issue-732541919
const zodSchema = () => {
  const ContentJsonSchema = z.object({
    id: z.string().optional().nullable(),
    title: z.string().optional().nullable(),
    version: z.union([z.number(), z.string()]).optional().nullable(),
  });

  const AnswerJsonSchema = z.object({
    key: z.string().optional().nullable(),
    value: z.any().optional().nullable(),
  });

  const ResultJsonSchema = z.object({
    key: z.string().optional().nullable(),
    value: z.any().optional().nullable(),
  });
  const EntryJsonSchema = z.object({
    a: z.string().optional().nullable(),
    b: z.string().optional().nullable(),
    id: z.string().optional().nullable(),
    creation: z.string().optional().nullable(),
    content: ContentJsonSchema.optional().nullable(),
    labels: z.string().array().optional().nullable(),
    answers: AnswerJsonSchema.array().optional().nullable(),
    results: ResultJsonSchema.array().optional().nullable(),
  });

  return EntryJsonSchema;
};

const valibotSchema = () => {
  const ContentJsonSchema = v.object({
    id: v.nullable(v.optional(v.string())),
    title: v.nullable(v.optional(v.string())),
    version: v.optional(v.nullable(v.union([v.number(), v.string()]))),
  });

  const AnswerJsonSchema = v.object({
    key: v.nullable(v.optional(v.string())),
    value: v.nullable(v.optional(v.any())),
  });

  const ResultJsonSchema = v.object({
    key: v.nullable(v.optional(v.string())),
    value: v.nullable(v.optional(v.any())),
  });

  const EntryJsonSchema = v.object({
    a: v.nullable(v.optional(v.string())),
    b: v.nullable(v.optional(v.string())),
    id: v.nullable(v.optional(v.string())),
    creation: v.nullable(v.optional(v.string())),
    content: v.optional(v.nullable(ContentJsonSchema)),
    labels: v.optional(v.nullable(v.array(v.string()))),
    answers: v.nullable(v.optional(v.array(AnswerJsonSchema))),
    results: v.nullable(v.optional(v.array(ResultJsonSchema))),
  });

  return EntryJsonSchema;
};

export default {
  name: "optional-nullable",
  data: [
    {
      name: "valid",
      expected: { success: true },
      data: {
        a: "hello",
        b: "hello",
        id: "hello",
        creation: "hello",
        content: {
          id: "jfoeajef",
          title: "jfoeajef",
          version: 33333,
        },
        labels: ["jfioeaw", "fjeaiofejaw", "jfieoajfioeajofjaeo"],
        answers: [
          {
            key: "jfeoiaojfe",
            value: { anyvalue: "any" },
          },
          {
            key: "jfeoiaojfe",
            value: { anyvalue: "any" },
          },
          {
            key: "fjieoawjfiaw",
            value: { anyvalue: "any" },
          },
          {
            key: "jifoaw",
            value: { anyvalue: "any" },
          },
        ],
        results: [
          {
            key: "jfeoiaojfe",
            value: { anyvalue: "any" },
          },
          {
            key: "fjieoawjfiaw",
            value: { anyvalue: "any" },
          },
          {
            key: "fjieoawjfiaw",
            value: { anyvalue: "any" },
          },
          {
            key: "jfeoiaojfe",
            value: { anyvalue: "any" },
          },
          {
            key: "jifoaw",
            value: { anyvalue: "any" },
          },
        ],
      },
    },
  ],
  schema: {
    valibot: valibotSchema(),
    zod: zodSchema(),
  },
} satisfies TestCase;
