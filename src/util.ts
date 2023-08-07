import * as z from "zod";
import * as v from "valibot";

type ParseResult =
  | {
      success: true;
      data: unknown;
    }
  | {
      success: false;
      error: { issues: unknown[] };
    };

export const createParse = (
  schema: z.Schema | v.BaseSchema,
): ((data: unknown) => ParseResult) => {
  if (schema instanceof z.ZodType) {
    return (data: unknown) => schema.safeParse(data);
  }
  return (data: unknown) => v.safeParse(schema, data);
};
