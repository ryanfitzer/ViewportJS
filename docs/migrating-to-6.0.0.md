# Migrating to v6.0.0 #

## New Features ##

TypeScript support.

## Breaking Changes ##

The server-side behavior has been updated:

When initialized with an array of viewport configuration objects:

```js
const myViewports = viewport( [
    {
        name: 'small',
        query: '( min-width:0px ) and ( max-width:480px )'
    },
    {
        name: 'medium',
        query: '( min-width:480px ) and ( max-width:767px )'
    },
    {
        name: 'large',
        query: '( min-width:769px )'
    }
] );
```
all methods now return the same types as in the client-side environment (previously returned `undefined`).

Since the server-side environment does not support `window.matchMedia`, the first viewport in the configuration array will always be the viewport that is current. The previous viewport will be `undefined`.

**Note**: The server-side behavior when subscribing directly to a `mediaQueryString` has not been changed.