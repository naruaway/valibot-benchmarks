import * as v from "valibot";

// Originally from: https://github.com/colinhacks/zod/issues/205#issue-732541919

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

export default valibotSchema();
