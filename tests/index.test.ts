import { describe, test, expect } from 'bun:test';
import * as st from '@safe-std/error';

describe('error', () => {
  test('basic', () => {
    const e = st.err('Hi');
    expect(st.isErr(e));
    expect(e.payload).toBe('Hi');
  });

  test('tagged', () => {
    class AErr<const out T> extends st.Err<T, 'a'> { };
    class BErr<const out T> extends st.Err<T, 'b'> { };

    const f = (x: number) =>
      x <= 0
        ? new AErr('Number is smaller than 0')
        : x < 1
          ? new BErr('Number is smaller than 1')
          : x;

    expect(f(0)).toBeInstanceOf(AErr);
    expect(f(0.5)).toBeInstanceOf(BErr);
    expect(f(1)).toBe(1);

    expect(st.err('')).not.toBeInstanceOf(AErr);
    expect(st.err('')).not.toBeInstanceOf(BErr);
  });

  describe('try', () => {
    test('sync', () => {
      expect(
        st.isErr(
          st.trySync(decodeURIComponent, '%FF%G0')
        )
      ).toBeTrue();
    });

    test('async', async () => {
      expect(
        st.isErr(
          await st.tryPromise(fetch('invalidurl'))
        )
      ).toBeTrue();
    });
  });
});
