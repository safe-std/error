import * as st from '@safe-std/error';

const fooErr = st.taggedErr('foo');
const barErr = st.taggedErr('bar');

const res = Math.random() < 0.5 ? fooErr('foo') : barErr('bar');
if (st.isErr(res)) {
  switch (st.tag(res)) {
    case 'bar':
      console.log('Bar');
      break;

    case 'foo':
      console.log('Foo');
      break;
  }
}
