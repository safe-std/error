import { summary, run, bench, do_not_optimize } from 'mitata';

const sym = Symbol();
const arrayErr = (val: any) => [sym, val];
const arrayIsErr = (x: any) => Array.isArray(x) && x[0] === sym;
const arrayPayload = (x: any) => x[1];

class ObjErr {
  payload: any;
  constructor(payload: any) {
    this.payload = payload;
  }
}
const objectErr = (val: any) => new ObjErr(val);
const objectIsErr = (x: any) => x instanceof ObjErr;

summary(() => {
  bench('check & get payload - error array', function* () {
    yield {
      [0]: () => arrayErr(Math.random()),
      bench(x: any) {
        if (arrayIsErr(x))
          do_not_optimize(arrayPayload(x));
      }
    }
  }).gc('inner');

  bench('check & get payload - error object', function* () {
    yield {
      [0]: () => objectErr(Math.random()),
      bench(x: any) {
        if (objectIsErr(x))
          do_not_optimize(x.payload);
      }
    }
  }).gc('inner');
});

summary(() => {
  bench('create & check & get payload - error array', () => {
    const err = arrayErr(Math.random());
    do_not_optimize(err);
    if (arrayIsErr(err))
      do_not_optimize(arrayPayload(err));
  }).gc('inner');

  bench('create & check & get payload - error object', () => {
    const err = objectErr(Math.random());
    do_not_optimize(err);
    if (objectIsErr(err))
      do_not_optimize(err.payload);
  }).gc('inner');
});

// Start the benchmark
run();
