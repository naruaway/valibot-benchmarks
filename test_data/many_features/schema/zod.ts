import * as z from "zod";

export default z.object({
  one: z.array(
    z
      .object({
        items: z.array(
          z.object({
            val: z.union([z.literal("hello"), z.literal("world")]).optional(),
            str: z
              .string()
              .min(2)
              .max(5)
              .transform((a) => a + "_APPENDED"),
            num: z.number().min(100).max(200).transform(String),
          }),
        ),
      })
      .transform((o) => ["FIRST", ...o.items]),
  ),
});
