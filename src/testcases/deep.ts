import * as z from "zod";
import * as v from "valibot";
import type { TestCase } from "../types.js";

export default {
  name: 'deep',
  data: [
    {
      name: 'valid',
      expected: { success: true },
      data: {
        a: {
          b: {
            c: {
              d: {
                e: {
                  f: {
                    g: {
                      h: {
                        i: {
                          j: {
                            k: {
                              l: {
                                m: {
                                  n: {
                                    o: {
                                      p: {
                                        q: {
                                          r: {
                                            s: {
                                              t: {
                                                u: {
                                                  v: {
                                                    w: {
                                                      x: { y: { z: "hello" } },
                                                    },
                                                  },
                                                },
                                              },
                                            },
                                          },
                                        },
                                      },
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  ],
  schema: {
    valibot: v.object({
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
                                                        z: v.union([v.string(), v.number()])
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
    }),
    zod: z.object({
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
                                                        z: z.union([z.string(), z.number()])
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
    }),
  },
} satisfies TestCase;
