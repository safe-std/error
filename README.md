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
value.payload; // 'An error occured'
```

## `st.isErr(value)`
Check whether `value` is an error.
```ts
const value = Math.random() < 0.5 ? 0 : st.err('Random');
if (st.isErr(value)) {
  value.payload; // 'Random'
} else {
  value; // 0
}
```


## `st.error`
Represents a generic error with no payload.
```ts
st.error; // st.Err<undefined>
```

## `tryPromise(promise)`
Safely catch errors from `promise`.
```ts
// Safely catch fetch call error
const response = await st.tryPromise(
  fetch('http://example.com')
);
if (st.isErr(response)) {
  response.payload; // unknown
} else {
  response; // Response
}
```

## `tryAsync(fn)`
Create a new function that wraps async function `fn` errors safely.
```ts
const response = st.tryAsync(fetch, 'http://example.com');
if (st.isErr(response)) {
  response.payload; // unknown
} else {
  response; // Response
}
```

## `trySync(fn)`
Create a new function that wraps sync function `fn` errors safely.
```ts
const result = trySync(decodeURIComponent, '%FF%G0');
if (st.isErr(result)) {
  result.payload; // unknown
} else {
  result; // string
}
```

## Tagging error
```ts

declare const httpErrSymbol: unique symbol;

// Prevent HttpErr from being assignable to Err with equivalent payload
interface HttpErr {
  [httpErrSymbol]: null;
}

class HttpErr extends st.Err<{
  status: number,
  statusText: string
}> {};

const badReq = new HttpErr({
  status: 400,
  statusText: 'Bad request'
});
badReq.payload; // { status: 400, statusText: 'Bad request' }

// Error checking
if (err instanceof HttpErr) {
  err.payload; // { status: ..., statusText: ... }
}
````
