# Valibot Benchmarks

**See the latest benchmark results in https://naruaway.github.io/valibot-benchmarks/**

[Valibot](https://github.com/fabian-hiller/valibot) is known for its extremely small bundle size and tree-shakability thanks to its simple architecture.
It would be even nice if Valibot is faster than competitors, notably, [Zod](https://github.com/colinhacks/zod).

We already have a great benchmark suite ([typescript-runtime-type-benchmarks](https://github.com/moltar/typescript-runtime-type-benchmarks)) to compare many libraries but I (@naruaway) just wanted to create another benchmark suite to focus on improving Valibot performance. For example, this repo includes more diverse set of schema and data so that we can detect performance issue for specific patterns. Also this benchmark runs on more environments including Node.js, Bun, Deno, and probably more in the future (e.g. web browsers), which helps us to avoid optimizing for a specific JavaScript engine such as V8.

## How to run the benchmarks locally

1. Run `npm ci` to install npm packages
2. Edit [./config.ts](./config.ts) to suit your needs. You can configure it to use locally built packages for example.
3. Run `npm run bench` to run benchmarks. The benchmark results will be stored in ./results directory
4. (optional) You can check visual results by running `npm run next:dev` and open `http://localhost:3000/valibot-benchmarks`

## How to add new test data

Please check [./test_data/](./test_data/) directory.
