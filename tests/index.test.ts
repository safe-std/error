import { describe, test, expect } from 'bun:test';
import * as st from '@safe-std/error';

describe('error', () => {
  test('basic', () => {
    const e = st.err('Hi');

    expect(st.payload(e)).toBe('Hi');
    expect(st.isTagged(e)).toBe(false);
  });

  test('tagged', () => {
    const aErr = st.taggedErr('a');
    const bErr = st.taggedErr('b');

    const f = (x: number) =>
      x <= 0
        ? aErr('Number is smaller than 0')
        : x < 1
          ? bErr('Number is smaller than 1')
          : x;

    expect(st.tag(f(0) as st.TaggedErr)).toBe('a');
    expect(st.tag(f(0.5) as st.TaggedErr)).toBe('b');
    expect(f(1)).toBe(1);
  });

  describe('try', () => {
    test('sync', () => {
      const decode = st.syncTry(decodeURIComponent);
      expect(st.isErr(decode('%FF%G0'))).toBeTrue();
    });

    test('async', async () => {
      expect(st.isErr(await st.promiseTry(fetch('invalidurl')))).toBeTrue();
    });
  });
});
