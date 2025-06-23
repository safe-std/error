import { summary, run, bench, do_not_optimize } from 'mitata';

const err: [] = [];

const pause = async <P>(p: Promise<P>): Promise<P> => {
  const res = await p;
  return res === err ? Promise.reject(err) : res;
};

// Fiber using promises
const promise = async (p1: Promise<number>, p2: Promise<number>) => {
  const x1 = await pause(p1);
  const x2 = await pause(p2);

  return x1 + x2;
};

const f = (e: any) => e;
const handle = (p: Promise<any>) => p.catch(f);

const wrap = function* <T>(p: Promise<T>): Generator<T, T> {
  // @ts-ignore
  return yield p;
};

// Fiber using gen
const gen = function* (p1: Promise<number>, p2: Promise<number>) {
  const x1 = yield* wrap(p1);
  const x2 = yield* wrap(p2);

  return x1 + x2;
};

const genRunner = async (g: Generator) => {
  let t = g.next();

  while (!t.done) {
    const v = await t.value;
    if (v === err) return err;
    t = g.next(v);
  }

  return t.value;
};

console.log(
  'Promise',
  await handle(promise(Promise.resolve(10), Promise.resolve(10))),
);
console.log(
  'Generators',
  await genRunner(gen(Promise.resolve(10), Promise.resolve(10))),
);

summary(() => {
  bench('No error - Promises', function* () {
    yield {
      [0]() {
        return Promise.resolve(10);
      },
      [1]() {
        return Promise.resolve(11);
      },
      async bench(a: Promise<number>, b: Promise<number>) {
        do_not_optimize(await handle(promise(a, b)));
      },
    };
  });

  bench('No error - Generators', function* () {
    yield {
      [0]() {
        return Promise.resolve(10);
      },
      [1]() {
        return Promise.resolve(11);
      },
      async bench(a: Promise<number>, b: Promise<number>) {
        do_not_optimize(await genRunner(gen(a, b)));
      },
    };
  });
});

summary(() => {
  bench('First error - Promises', function* () {
    yield {
      [0]() {
        return Promise.resolve(err);
      },
      [1]() {
        return Promise.resolve(11);
      },
      async bench(a: Promise<number>, b: Promise<number>) {
        do_not_optimize(await handle(promise(a, b)));
      },
    };
  });

  bench('First error - Generators', function* () {
    yield {
      [0]() {
        return Promise.resolve(err);
      },
      [1]() {
        return Promise.resolve(11);
      },
      async bench(a: Promise<number>, b: Promise<number>) {
        do_not_optimize(await genRunner(gen(a, b)));
      },
    };
  });
});

// No error
summary(() => {
  bench('Second error - Promises', function* () {
    yield {
      [0]() {
        return Promise.resolve(10);
      },
      [1]() {
        return Promise.resolve(err);
      },
      async bench(a: Promise<number>, b: Promise<number>) {
        do_not_optimize(await handle(promise(a, b)));
      },
    };
  });

  bench('Second error - Generators', function* () {
    yield {
      [0]() {
        return Promise.resolve(10);
      },
      [1]() {
        return Promise.resolve(err);
      },
      async bench(a: Promise<number>, b: Promise<number>) {
        do_not_optimize(await genRunner(gen(a, b)));
      },
    };
  });
});

// Start the benchmark
run();
