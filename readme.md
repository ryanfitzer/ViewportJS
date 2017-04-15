# ViewportJS #

[![NPM version](https://badge.fury.io/js/viewportjs.svg)](https://www.npmjs.com/package/viewportjs)

ViewportJS is an API on top of `window.matchMedia` that gives more structure to subscribing and querying viewports.

- 1.23 kB minified & gzipped.
- Supports all modern browsers that support `window.matchMedia`.
- Supports Node, AMD, or being used as a browser global (via [UMD](https://github.com/umdjs/umd)).



## Features ##

1. Register viewports by name:

    ```js
    var myViewports = viewport([
        {
            name: 'small',
            width: [ 0, 480 ] // ( min-width:0px ) and ( max-width:480px )
        },
        {
            name: 'medium',
            width: [ 481, 768 ] // ( min-width:480px ) and ( max-width:767px )
        },
        {
            name: 'large',
            width: [ 769 ] // ( min-width:769px )
        }
    ]);
    ```

2. Subscribe/Unsubscribe to viewports by name to receive updates when `name` becomes valid/invalid:

    ```js
    // Subscribe
    var svpUnsubscribe = myViewports.subscribe( 'small', function( matches, viewportObj ) {
        // Do something when the small viewport becomes valid/invalid
    });
    
    // Unsubscribe
    svpUnsubscribe();
    ```

3. Subscribe to all viewports:

    ```js
    myViewports.subscribe( '*', function( viewport ) {
        // do something
    });
    ```

4. Check if the `small` viewport is valid:

    ```js
    myViewports.matches( 'small' );
    ```

5. Check if `small` is the current viewport:

    ```js
    myViewports.is( 'small' );
    ```

6. Get the current viewport object:

    ```js
    var current = myViewports.current();
    ```



## Usage ##

The `viewport` method takes a `viewports` array and an `options` object:

```js
var myViewports = viewport( viewports, options );
```

The `viewports` argument is an array of viewport objects:

```js
var myViewports = viewport([
    {
        name: 'small',
        width: [ 0, 480 ] // ( min-width:0px ) and ( max-width:480px )
    },
    {
        name: 'medium',
        width: [ 481, 768 ] // ( min-width:480px ) and ( max-width:767px )
    },
    {
        name: 'large',
        width: [ 769 ] // ( min-width:769px )
    }
]);
```



## Viewport Object Properties ##

The `viewports` array is made up of 1 or more viewport objects. A viewport object consists of a `name` and a `width` and/or `height` array.


### `name` ###

A `String` representing the viewport's nickname. Required.
    

### `width` ###

An `Array` of `Number` values representing the min/max-width. Example:

```js  
width: [ 960 ]      // ( min-width:960px )
width: [ 0, 960 ]   // ( min-width:0px ) and ( max-width:960px )
width: [ 480, 960 ] // ( min-width:480px ) and ( max-width:960px )
```

### `height` ###

An `Array` of `Number` values representing the min/max-height. Example:

```js
height: [ 960 ]      // ( min-height:960px )
height: [ 0, 960 ]   // ( min-height:0px ) and ( max-height:960px )
height: [ 480, 960 ] // ( min-height:480px ) and ( max-height:960px )
```



## Options ##

### units ###

The [unit of length](https://developer.mozilla.org/en-US/docs/Web/CSS/length) to use for the provided dimensions.

  - Required: No
  - Type: `String`
  - Default: `px`


### delay ###

The number of milliseconds to delay the viewport subscribers.

  - Required: No
  - Type: `Number`
  - Default: 0




## Methods ##


### `current()` ###

Checks each viewport and returns the last matching viewport object based on the `viewports` array configuration order. So if you prefer a "mobile-first" approach, your `viewports` array should be ordered from smallest to largest. Returns the current viewport object.

```js
var currentVP = myViewports.current();
```

### `is( name )` ###

Checks if the specified viewport is the current viewport. Returns a `Boolean`. (See the `current` method for more info on how this is determined.)

```js
if ( myViewports.is( 'small' ) ) {
    // do something
}
```

### `matches( name )` ###

Checks if the specified viewport's condition matches. Returns a `Boolean`.

```js
if ( myViewports.matches( 'small' ) ) {
    // do something
}
```

### `subscribe( name, handler )` ###

Subscribe for updates when a specific viewport becomes valid/invalid. The handler is passed a `matches` `Boolean` for checking if the viewport has become valid/invalid, as well as the current viewport's object. All subscribers are checked for validity when first subscribed in order to allow for lazy subscribers. The `subscribe` method returns an `unsubscribe` method.

There is also a reserved viewport name, `*`, to allow for subscribing to all viewports at once. Its handler receives the current viewport's object.

```js
var svpUnsubscribe = myViewport.subscribe( 'small', function( matches, viewport ) {
    
    if ( matches ) {
        // do something
    } else {
        // do another thing
    }
});
```



## Properties ##


### `viewports` ###

The original array of viewport objects.


### `vps` ###

An object keyed by the viewport names which contains its respective `MediaQueryList` object.

```js
{
    'small': {
        name: 'small',
        mql: {MediaQueryList}
    },
    'medium': {...},
    'large': {...},
}
```



## Known Issues ##

  - Safari has a 1px delta: https://github.com/WickyNilliams/enquire.js/issues/79

