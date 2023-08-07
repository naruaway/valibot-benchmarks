import * as v from "valibot";

export default v.object({
  a: v.object({
    b: v.object({
      c: v.object({
        d: v.object({
          e: v.object({
            f: v.object({
              g: v.object({
                h: v.object({
                  i: v.object({
                    j: v.object({
                      k: v.object({
                        l: v.object({
                          m: v.object({
                            n: v.object({
                              o: v.object({
                                p: v.object({
                                  q: v.object({
                                    r: v.object({
                                      s: v.object({
                                        t: v.object({
                                          u: v.object({
                                            v: v.object({
                                              w: v.object({
                                                x: v.object({
                                                  y: v.object({
                                                    z: v.union([
                                                      v.string(),
                                                      v.number(),
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
