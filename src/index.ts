/**
 * @module Basic error handling
 */

// Limit type hint as much as possible
type NoProp = Readonly<Record<string | number | symbol, never>>;

// Error identifier
const _: unique symbol = Symbol.for('@safe-std/error') as any;

// Don't expose error props
declare const _p: unique symbol;
declare const _t: unique symbol;

/**
 * Describe an error
 */
export type Err<T = unknown> = NoProp & { [_p]: T };

/**
 * Describe a tagged error
 */
export type TaggedErr<Tag = unknown, T = unknown> = Err<T> & { [_t]: Tag };

/**
 * Infer the result type from a type
 */
export type InferResult<T> = Exclude<T, Err>;

/**
 * Infer the error type from the error type
 */
export type InferErr<T> = Extract<T, Err>;

/**
 * Infer the error payload type
 */
export type InferPayload<T extends Err> = T[typeof _p];

/**
 * Infer the error tag type
 */
export type InferTag<T extends TaggedErr> = T[typeof _t];

/**
 * Check whether input is an error
 * @param t
 */
export const isErr = (t: any): t is Err => Array.isArray(t) && t[0] === _;

/**
 * Create an error from the payload
 * @param payload
 */
export const err = <const T>(payload: T): Err<T> => [_, payload] as any;

/**
 * A generic error
 */
export const error: Err<undefined> = [_, ,] as any;

/**
 * Return the payload of an error
 * @param e - The error to extract the payload
 */
export const payload = <const T>(e: Err<T>): T => e[1];

/**
 * Get the tag of a tagged error union
 * @param e - The tagged error union
 */
export const tag = <const T>(e: TaggedErr<T>): T => e[2];

/**
 * Create a tagged error constructor
 * @param t - The error tag
 */
export const taggedErr: <const T, E>(
  t: T,
) => <const P extends E>(payload: P) => TaggedErr<T, P> =
  (t: any) => (p: any) =>
    [_, p, t] as any;

/**
 * Check if an error is tagged
 * @param e - The error to be checked
 */
export const isTagged = <const T>(e: Err<T>): e is TaggedErr<any, T> =>
  e.length > 2;

/**
 * Check if an error is tagged with a specific tag
 * @param tag - The tag to check with
 * @param e - The error to be checked
 */
export const taggedWith = <const T, const P>(
  tag: T,
  e: Err<P>,
): e is TaggedErr<T, P> => isTagged(e) && e[2] === tag;

/**
 * Catch promise error safely
 * @param p
 */
export const promiseTry = <const T>(p: Promise<T>): Promise<T | Err> =>
  p.catch(err);

/**
 * Wrap a sync function and return thrown error as a native error
 * @param fn
 */
export const syncTry = <const P, const F extends (...args: any[]) => any>(
  fn: F,
): F | ((...args: Parameters<F>) => Err<P>) =>
  ((...args) => {
    try {
      return fn(...args);
    } catch (e) {
      return err(e) as any;
    }
  }) as F;

/**
 * Wrap an async function and return thrown error
 * @param fn
 */
export const asyncTry = <
  const P,
  const F extends (...args: any[]) => Promise<any>,
>(
  fn: F,
): F | ((...args: Parameters<F>) => Promise<Err<P>>) =>
  ((...args) => promiseTry(fn(...args))) as F;
