# ViewportJS #

[![NPM version](https://badge.fury.io/js/viewportjs.svg)](https://www.npmjs.com/package/viewportjs)

ViewportJS is an API on top of `window.matchMedia` that gives more features and structure to subscribing and querying viewports. To support scenarios where `window.matchMedia` isn't available (server-side rendering, for example), a [noop](https://en.wikipedia.org/wiki/NOP) API is returned.

- 1.15 kB minified & gzipped.
- Supports all browsers that support [`window.matchMedia`](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia).
- Supports Node, AMD, and as a browser global (via [UMD](https://github.com/umdjs/umd)).



## Installation ##


### npm ###


```bash
npm install viewportjs
```

### AMD ###

The API is exported as an unnamed module. If you're not familiar with AMD, [RequireJS](https://requirejs.org/docs/start.html) is a great place to start.


### Browser Global ###

Download the latest [development](https://unpkg.com/viewportjs/dist/viewport.js) and [production](https://unpkg.com/viewportjs/dist/viewport.min.js) versions from [UNPKG](https://unpkg.com/viewportjs/dist/).

```html
<!-- Note: when deploying, replace "viewport.js" with "viewport.min.js". -->
<script src="viewport.js"></script>
```

Once loaded, the `viewport` function can be accessed globally.



## Usage ##

Configure viewports by name and subscribe to their changes:

```js
const myViewports = viewport([
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
]);

// Subscribe to changes in 'small' viewport
myViewports( 'small', state => {} );

// Subscribe to changes in all viewports
myViewports( state => {} );

```

You can also query the state of the configured viewports:

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



## Configuration ##

The initialization method takes an array of viewport configuration objects:

```js
const myViewports = viewport([
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
]);
```



## Viewport Object Properties ##

The configuration array is made up of 1 or more viewport configuration objects. A viewport object requires 2 properties:

- `name` *(string)* The viewport's nickname.

- `query` *(string)* A valid [`mediaQueryString`](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries#Syntax).



## Methods ##


### `current( [name] )` ###

When called with the `name` argument, checks if `name` is the current viewport. Otherwise, returns the current viewport's state object.

The current viewport is determined by looking for the last matching viewport based on the order of the `viewports` configuration array. So if you prefer a "mobile-first" approach, your `viewports` array should be ordered from smallest to largest.

If there is no current viewport, the state object for the `undefined` viewport is returned: `{ name: undefined, matches: false, current: false }`.


Arguments:

  - `name`: *(string)* (optional) The name of the configured viewport to check.

Returns:

  - *(boolean)*: If `name` is the current viewport. 
  - *(Object)*: The state object of the current viewport.


```js
myViewports.current(); // `{ name: string, matches: boolean, current: boolean }`

myViewports.current( 'name' ); // true/false
```

### `matches( [name] )` ###

When called with the `name` argument, checks if the `name` viewport's media query matches. Otherwise, returns an array of all matching viewports.

If there are no matching viewports, an empty array is returned.


Arguments:

  - `name`: *(string)* (optional) The name of the configured viewport to check.

Returns:

  - *(boolean)*: If the `name` viewport matches.
  - *(Array)*: An array of state objects for all matching viewports.


```js
myViewports.matches(); // `[ { name: string, matches: boolean, current: boolean }, ... ]`

myViewports.matches( 'name' ); // true/false
```

### `previous( [name] )` ###

When called with the `name` argument, checks if the `name` viewport was the previously current viewport. Otherwise, returns the previously current viewport's state object.

If there was no previously current viewport, the state object for the `undefined` viewport is returned: `{ name: undefined, matches: false, current: false }`.


Arguments:

  - `name`: *(string)* (optional) The name of the configured viewport to check.

Returns:

  - *(boolean)*: If `name` was the previously current viewport.
  - *(Object)*: The state object of the previously current viewport.


```js
myViewports.previous(); // `{ name: string, matches: boolean, current: boolean }`

myViewports.previous( 'name' ); // true/false
```


### `remove()` ###



### `state( [name] )` ###











### `subscribe( name, handler )` ###

Subscribe to updates when a specific viewport becomes valid/invalid. The handler is passed arguments:

  - `matches`: `Boolean` A boolean for checking if the viewport has become valid/invalid.
  - `viewport`: `Object` The viewport's object.

All subscribers are checked for validity during initial subscription in order to allow for lazy subscribers. The `subscribe` method returns an `unsubscribe` method.

```js
const unsubSVP = myViewport.subscribe( 'small', function( matches, viewport ) {
    
    if ( matches ) {
        // Do something
    } else {
        // Do another thing
    }
});
```

#### Subscribe to All Viewports ####

(This approach is deprecated and [will be replaced with a new approach in version 3](https://github.com/ryanfitzer/ViewportJS/issues/7))

There is also a reserved viewport name, `*`, that enables subscribing to all viewports at once. Its handler receives:

  - `currentVP`: `Object` The current viewport's object. Same result as calling `.current()`.
  - `previousVP`: `Object` The previously current viewport's object. Same result as calling `.previous()`.

```js
const unsubAny = myViewport.subscribe( '*', function( currentVP, previousVP ) {
    
    // Do something
});
```
