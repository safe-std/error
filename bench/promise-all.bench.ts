import { summary, run, bench, do_not_optimize } from 'mitata';
import * as st from '@safe-std/error';

summary(() => {
  const data = new Array(1000).fill(0).map(() => {
    const dat = new Array(Math.ceil(Math.random() * 5 + 3)).fill(0).map(() => {
      const i = Math.random();
      return i < 0.5 ? Promise.resolve('str') : i < 0.7 ? 9 : null;
    });
    return () => dat.map((t) => t ?? Promise.reject(new Error()));
  });

  const setup = (label: string, fn: (arr: any[]) => any) =>
    bench(label, function* () {
      let i = 0;
      yield {
        [0]: () => {
          i = (i + 1) % data.length;
          return data[i]();
        },
        bench: fn,
      };
    });

  setup('native allSettled', async (d) => {
    do_not_optimize(await Promise.allSettled(d));
  });

  setup('safe-throw all', async (d) => {
    for (let i = 0; i < d.length; i++)
      if (d[i] instanceof Promise) d[i] = st.promiseTry(d[i]);

    do_not_optimize(await Promise.all(d));
  });

  setup('safe-throw all clone', async (d) => {
    const e = new Array(d.length);
    for (let i = 0; i < d.length; i++)
      e[i] = d[i] instanceof Promise ? st.promiseTry(d[i]) : d[i];

    do_not_optimize(await Promise.all(e));
  });
});

run();
