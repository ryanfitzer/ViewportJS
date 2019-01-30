# ViewportJS #

[![NPM version](https://badge.fury.io/js/viewportjs.svg)](https://www.npmjs.com/package/viewportjs) [![Build Status](https://api.travis-ci.org/ryanfitzer/ViewportJS.svg?branch=master)](https://travis-ci.org/ryanfitzer/ViewportJS?branch=master)  [![Maintainability](https://api.codeclimate.com/v1/badges/337f441a325e2fdec7cf/maintainability)](https://codeclimate.com/github/ryanfitzer/ViewportJS/maintainability) [![Greenkeeper badge](https://badges.greenkeeper.io/ryanfitzer/ViewportJS.svg)](https://greenkeeper.io/) 

ViewportJS is built on top of `window.matchMedia` and provides valuable features that enable more structure when querying and subscribing to media queries.

  - 1.19 kB minified & gzipped.
  
  - Supports all browsers that [support `window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia#Browser_compatibility).
  
  - Compatible with CommonJS, AMD, and browser globals (via [UMD](https://github.com/umdjs/umd)).
  
  - Supports SSR (server-side rendering) by providing a shallow API when `window.matchMedia` is unavailable.

Give the [demo](http://ryanfitzer.github.io/ViewportJS/demo) a try by changing the size of your browser window and watch the UI update.

If you are upgrading from [v2](../../tree/v2.1.0), please see the [v3 migration guide](docs/migrating-to-3.0.0.md).


------
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
  - [CommonJS](#commonjs)
  - [AMD](#amd).
  - [Browser Globals](#browser-globals)
- [Usage](#usage)
- [Configuration](#configuration)
- [Subscribing to Viewport Changes](#subscribing-to-viewport-changes)
  - [Subscribing to a Single Media Query](#subscribing-to-a-single-media-query)
- [Instance Methods](#instance-methods)
  - [`current( [name] )`](#current-name-)
  - [`matches( [name] )`](#matches-name-)
  - [`previous( [name] )`](#previous-name-)
  - [`remove()`](#remove)
  - [`state( [name] )`](#state-name-)
- [Server-Side Rendering](#server-side-rendering)
- [Examples](#examples)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->


## Installation ##


### CommonJS ###


Install the latest version from [npm](https://www.npmjs.com/package/viewportjs):

```bash
npm install viewportjs
```

Add the `viewportjs` package to your app:

```js
const viewport = require( 'viewportjs' );

const myViewports = viewport( /* configuration */ );
```

### AMD ###

The API is exported as an anonymous module. If you're not familiar with AMD, [RequireJS](https://requirejs.org/docs/start.html) is a great place to start.


### Browser Globals ###

Download the latest [development](https://unpkg.com/viewportjs/dist/viewport.js) and [production](https://unpkg.com/viewportjs/dist/viewport.min.js) versions from [UNPKG](https://unpkg.com/viewportjs/dist/). Once the script is loaded, the `viewport` function can be accessed globally.

```html
<!-- When deploying, replace "viewport.js" with "viewport.min.js". -->
<script src="viewport.js"></script>
<script>
  const myViewports = viewport( /* configuration */ );
</script>
```



## Usage ##

Configure viewports by name:

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

Once configured, you can query their state:

```js
// Check if `small` is the current viewport
myViewports.current( 'small' );  // boolean

// Get the current viewport object
myViewports.current(); // { name: 'small', matches: boolean, current: boolean }

// Check if the `small` viewport's media query matches
myViewports.matches( 'small' ); // boolean

// Retrieve all matches
myViewports.matches(); // [ /* matches viewport state objects */ ]
```

You can also subscribe to state changes:

```js
// Subscribe to changes in 'small' viewport
myViewports( 'small', state => {

  // Do something based on `state`
  // {
  //    name: 'small',
  //    matches: boolean,
  //    current: boolean
  // }
  
} );
```



## Configuration ##

The initialization method takes an array of viewport configuration objects that are composed of two properties:

- `name` *(string)* The viewport's nickname. Must be unique.

- `query` *(string)* A valid [`mediaQueryString`](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#Syntax).

The order of these objects in the array is important because it determines how to calculate the `current` viewport, which is defined as the last matching viewport based on the order of the configuration array. So if you prefer a "mobile-first" approach, your viewport configuration objects should be ordered from smallest to largest.

The initialization method returns a configured instance that can act as:

   - A function used to subscribe to viewport changes.
   - An object that contains methods for querying viewport state.



## Subscribing to Viewport Changes ##

The initialization method returns an instance that can be used to subscribe to state changes on the configured viewports.

Arguments:

  - `name`: *(string)* (optional) The name of a configured viewport.
  - `handler`: *(Function)* The function to execute whenever state changes occur.

Returns:

  - *(Function)*: A function that unsubscribes `handler`.

To subscribe to the state of an individual viewport, both `name` and `handler` are required. Providing only a `handler` will set up a subscription to the states of all configured viewports.

A subscriber's `handler` is executed whenever there's a change in either the viewport's `matched` or `current` state. When a subscriber is added, it's `handler` will be immediately executed if either its viewport(s) `current` or `matched` state is `true`.

The `handler` receives the following arguments when executed:

  - `state`: *(Object)* The changed viewport's state object.
  - `instance`: *(Object)* The configured instance.

A viewport state object has three properties:

  - `name`: *(string)* The name of a configured viewport.
  - `matches`: *(boolean)* If the viewport's media query matches.
  - `current`: *(boolean)* If the viewport is current.

Example:

```js
const myViewports = viewport( /* configuration */ );

// Subscribe to an individual configured viewport
myViewports( 'name', state => {} );

// Subscribe to all configured viewport
myViewports( state => {} )
```

### Subscribing to a Single Media Query ###

For times where you're only interested in matching single a media query, you can provide the initialization method with a valid [`mediaQueryString`](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#Syntax) and an optional `handler`, instead of a configuration array. This will return an instance with a limited API.

Arguments:

  - `query`: *(string)* A valid `mediaQueryString`.
  - `handler`: *(Function)* (optional) The function to execute whenever state changes occur.

Returns:

  - *(Object)*: A limited API composed of the `matches()` and `remove()` method.

If provided, `handler` is executed whenever there's a change in the media query's `matched` state, including on initial subscription.

The `handler` receives the following arguments when executed:

  - `matches`: *(boolean)* If the media query matches.
  - `instance`: *(Object)* The configured instance.

Example:

```js
const smallvp = viewport( '( max-width: 500px )', state => {} );

smallvp.matches(); // true/false
smallvp.remove(); // remove the handler, if provided.
```



## Instance Methods ##


### `current( [name] )` ###

When called with the `name` argument, checks if `name` is the current viewport and returns a boolean. Otherwise, it returns the current viewport's state object.

The current viewport is defined as the last matching viewport based on the order of the configuration array. If there is no current viewport, the state object for the `undefined` viewport is returned: `{ name: undefined, matches: false, current: false }`.


Arguments:

  - `name`: *(string)* (optional) The name of the configured viewport to check.

Returns:

  - *(boolean)*: If `name` is the current viewport. 
  - *(Object)*: The state object of the current viewport.


```js
myViewports.current(); // { name: string, matches: boolean, current: boolean }

myViewports.current( 'name' ); // true/false
```

### `matches( [name] )` ###

When called with the `name` argument, checks if the `name` viewport's media query matches. Otherwise, it returns an array of all matching viewports.

If there are no matching viewports, an empty array is returned.


Arguments:

  - `name`: *(string)* (optional) The name of the configured viewport to check.

Returns:

  - *(boolean)*: If the `name` viewport matches.
  - *(Array)*: An array of state objects for all matching viewports.


```js
myViewports.matches(); // [ { name: string, matches: boolean, current: boolean }, ... ]

myViewports.matches( 'name' ); // true/false
```

### `previous( [name] )` ###

When called with the `name` argument, checks if the `name` viewport was the previously current viewport. Otherwise, it returns the previously current viewport's state object.

If there was no previously current viewport, the state object for the `undefined` viewport is returned: `{ name: undefined, matches: false, current: false }`.


Arguments:

  - `name`: *(string)* (optional) The name of the configured viewport to check.

Returns:

  - *(boolean)*: If `name` was the previously current viewport.
  - *(Object)*: The state object of the previously current viewport.


```js
myViewports.previous(); // { name: string, matches: boolean, current: boolean }

myViewports.previous( 'name' ); // true/false
```


### `remove()` ###

Removes all the instance's configured viewports and subscribers at once.

Returns:

  - *(null)*: Subscribers are removed and values set to `null`.

```js
const myViewports = viewport( /* viewport config array */ );

myvps( 'small', state => {} );
myvps( 'medium', state => {} );

myvps.remove();
```

### `state( [name] )` ###

When called with the `name` argument, returns the named viewport's state object. Otherwise, it returns an array of state objects for all viewports.

Arguments:

  - `name`: *(string)* (optional) The name of the configured viewport to check.

Returns:

  - *(Object)*: The state object of the named viewport.
  - *(Array)*: An array of state objects for all viewports.


```js
myViewports.state(); // [ { name: string, matches: boolean, current: boolean }, ... ]

myViewports.previous( 'name' ); // { name: string, matches: boolean, current: boolean }
```



## Server-Side Rendering ##

ViewportJS supports SSR (or "Universal JavaScript") through a shallow API that enables the use of all methods in an environment where `window.matchMedia` is unavailable.

Due to potential memory leaks, calls that subscribe to viewports should only be made when their respective unsubscribe functions (or the instance's `remove()` method) can be called in the same environment. Initialization and query methods can be used in any environment, but it's best if subscriptions are made in code that only executes in the browser. The `development` build of ViewportJS will log a warning whenever a subscription is made in an environment where `window.matchMedia` is unavailable. All logging is removed in the `production` build.



## Examples ##

- [Vanilla](https://codesandbox.io/s/q3no20volw?module=%2Fsrc%2Findex.js)
- [React](https://codesandbox.io/s/00l82nl6pv?module=%2Fsrc%2Fvpjs-component.js)
- [Vue](https://codesandbox.io/s/zw8283vyol?module=%2Fsrc%2Fcomponents%2Fvpjs-component.vue)
- Angular (todo)
- Riot (todo)
- [Next.js](https://codesandbox.io/s/q3r0xympjq?module=%2Fcomponents%2Fvpjs-component.js)
- Nuxt.js (todo)
- Ember (todo)





