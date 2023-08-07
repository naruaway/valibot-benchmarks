import * as v from "valibot";

export default v.object({
  one: v.array(
    v.transform(
      v.object({
        items: v.array(
          v.object({
            val: v.optional(v.union([v.literal("hello"), v.literal("world")])),
            str: v.transform(
              v.string([v.minLength(2), v.maxLength(5)]),
              (a) => a + "_APPENDED",
            ),
            num: v.transform(
              v.number([v.minValue(100), v.maxValue(200)]),
              String,
            ),
          }),
        ),
      }),
      (o) => ["FIRST", ...o.items],
    ),
  ),
});
