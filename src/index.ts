export class Err<out P = unknown> {
  payload: P;
  constructor(payload: P) {
    this.payload = payload;
  }
}

/**
 * Create an error from the payload
 * @param payload
 */
export const err = <const T>(value: T): Err<T> => new Err(value);

/**
 * Check whether input is an error
 * @param t
 */
export const isErr = (value: unknown): value is Err => value instanceof Err;

/**
 * Catch promise error safely
 * @param p
 */
export const tryPromise = <const T>(p: Promise<T>): Promise<T | Err> =>
  p.catch(err);

/**
 * Wrap a sync function and return thrown error as a native error
 * @param fn
 */
export const trySync = <const P, const F extends (...args: any[]) => any>(
  fn: F,
): F | ((...args: Parameters<F>) => Err<P>) =>
  ((...args) => {
    try {
      return fn(...args);
    } catch (e) {
      return new Err(e);
    }
  }) as F;

/**
 * Wrap an async function and return thrown error
 * @param fn
 */
export const tryAsync = <
  const P,
  const F extends (...args: any[]) => Promise<any>,
>(
  fn: F,
): F | ((...args: Parameters<F>) => Promise<Err<P>>) =>
  ((...args) => fn(...args).catch(err)) as F;
