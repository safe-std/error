declare const _: unique symbol;

export interface Err<P, T> {
  [_]: T;
}

/**
 * Describe any error
 */
export type AnyErr = Err<any, any>;

/**
 * Describe an error
 */
export class Err<const out P = unknown, const in out T = never> {
  payload: P;
  constructor(payload: P) {
    this.payload = payload;
  }
}

// Unique identifier
declare const _nativeSymbol: unique symbol;

/**
 * Describe a thrown error
 */
export class NativeErr<const out T = unknown> extends Err<T, typeof _nativeSymbol> {};

/**
 * Create an error from the payload
 * @param payload
 */
export const err = <const T>(value: T): Err<T> => new Err(value);

/**
 * Create a native error from the payload
 * @param payload
 */
export const nativeErr = <const T>(value: T): NativeErr<T> => new NativeErr(value)

/**
 * Check whether input is an error
 * @param t
 */
export const isErr = (value: unknown): value is Err => value instanceof Err;

/**
 * Catch promise error safely
 * @param p
 */
export const tryPromise = <const T>(p: Promise<T>): Promise<T | NativeErr> =>
  p.catch(nativeErr);

/**
 * Wrap a sync function and return thrown error as a native error
 * @param fn
 */
export const trySync = <const P extends Error, const F extends (...args: any[]) => any>(
  fn: F, ...args: Parameters<F>
): ReturnType<F> | NativeErr<P> => {
  try {
    return fn(...args);
  } catch (e) {
    return new NativeErr(e as P);
  }
}

/**
 * Wrap an async function and return thrown error
 * @param fn
 */
export const tryAsync = <
  const P,
  const F extends (...args: any[]) => Promise<any>,
>(
  fn: F, ...args: Parameters<F>
): ReturnType<F> | Promise<NativeErr<P>> =>
  fn(...args).catch(nativeErr);
