import * as z from "zod";

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

export default zodSchema();
