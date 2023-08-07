# Valibot Benchmarks

[Valibot](https://github.com/fabian-hiller/valibot) is known for its extremely small bundle size and tree-shakability thanks to its simple architecture.
It would be even nice if Valibot is faster than competitors, notably, [Zod](https://github.com/colinhacks/zod).

We already have a great benchmark suite ([typescript-runtime-type-benchmarks](https://github.com/moltar/typescript-runtime-type-benchmarks)) to compare many libraries but I (@naruaway) just wanted to create another benchmark suite to focus on improving Valibot performance. For example, this repo includes more diverse set of schema and data so that we can detect performance issue for specific patterns. Also this benchmark runs on more environments including Node.js, Bun, Deno, and probably more in the future (e.g. web browsers).
