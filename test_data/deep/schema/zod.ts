import * as z from "zod";

export default z.object({
  a: z.object({
    b: z.object({
      c: z.object({
        d: z.object({
          e: z.object({
            f: z.object({
              g: z.object({
                h: z.object({
                  i: z.object({
                    j: z.object({
                      k: z.object({
                        l: z.object({
                          m: z.object({
                            n: z.object({
                              o: z.object({
                                p: z.object({
                                  q: z.object({
                                    r: z.object({
                                      s: z.object({
                                        t: z.object({
                                          u: z.object({
                                            v: z.object({
                                              w: z.object({
                                                x: z.object({
                                                  y: z.object({
                                                    z: z.union([
                                                      z.string(),
                                                      z.number(),
                                                    ]),
                                                  }),
                                                }),
                                              }),
                                            }),
                                          }),
                                        }),
                                      }),
                                    }),
                                  }),
                                }),
                              }),
                            }),
                          }),
                        }),
                      }),
                    }),
                  }),
                }),
              }),
            }),
          }),
        }),
      }),
    }),
  }),
});
