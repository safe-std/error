A lightweight, low overhead errors-as-values API.

Features:
- Error type safety.
- No wrapping for success path.
- Minimal runtime cost.

# API
```ts
import * as st from '@safe-std/error';
```

## `st.err(payload)`
Create a new error.
```ts
const value = st.err('An error occured!'); // st.Err<'An error occured!'>
```

## `st.isErr(value)`
Check whether `value` is an error.
```ts
const value = Math.random() < 0.5 ? 0 : st.err('Random');
if (st.isErr(value)) {
  value; // st.Err<'Random'>
} else {
  value; // 0
}
```

## `st.payload(err)`
Get the payload of error `err`.
```ts
const value = Math.random() < 0.5 ? 0 : st.err('Random');
if (st.isErr(value)) {
  const errorPayload = st.payload(value); // 'Random'
} else {
  value; // 0
}
```

## `st.error`
Represents a generic error with no payload.
```ts
st.error; // st.Err<undefined>
```

## `taggedErr(tag)`
Create a tagged error constructor with tag `tag`.
```ts
const createHttpErr = st.taggedErr('http')<string>;
const bodyTypeErr = createHttpErr('Invalid body type'); // st.TaggedErr<'http', 'Invalid body type'>

// Restricting payload type
const createErrorId = st.taggedErr<'id', 0 | 1 | 2>('id');
const idErr = createErrorId(2); // st.TaggedErr<'id', '2'>
```

## `tag(err)`
Get the tag of tagged error `err`.
```ts
const createHttpErr = st.taggedErr('http');
const bodyTypeErr = createHttpErr('Invalid body type'); // st.TaggedErr<'http', 'Invalid body type'>

const tag = st.tag(bodyTypeErr); // 'http'
```

## `isTagged(err)`
Check whether error `err` is tagged.
```ts
const createHttpErr = st.taggedErr('http');
const bodyTypeErr = createHttpErr('Invalid body type'); // st.TaggedErr<'http', 'Invalid body type'>

console.log(st.isTagged(bodyTypeErr)); // logs 'true'
```

## `taggedWith(tag, err)`
Check whether error `err` is tagged with `tag`.
```ts
const createHttpErr = st.taggedErr('http');
const bodyTypeErr = createHttpErr('Invalid body type'); // st.TaggedErr<'http', 'Invalid body type'>

console.log(st.taggedWith(bodyTypeErr, 'http')); // logs 'true'
```

## `promiseTry(promise)`
Safely catch errors from `promise`.
```ts
// Safely catch fetch call error
const response = await st.promiseTry(
  fetch('http://example.com')
);
if (st.isErr(response)) {
  response; // st.Err<unknown>
} else {
  response; // Response
}
```

## `asyncTry(fn)`
Create a new function that wraps async function `fn` errors safely.
```ts
// Safely catch fetch call error
const safeFetch = st.asyncTry(async (url: string) => fetch(url));

const response = await safeFetch('http://example.com');
if (st.isErr(response)) {
  response; // st.Err<unknown>
} else {
  response; // Response
}
```

## `syncTry(fn)`
Create a new function that wraps sync function `fn` errors safely.
```ts
const safeDecode = st.syncTry((url: string) => decodeURIComponent(url));

const result = safeDecode('%FF%G0');
if (st.isErr(result)) {
  result; // st.Err<unknown>
} else {
  result; // string
}
```
