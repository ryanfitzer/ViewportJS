# ViewportJS #

An unassuming, no-frills tool to use your responsive viewports in JavaScript. ViewportJS exposes an API for querying and/or subscribing to viewport changes.

- 1.6 KB minified & gzipped.
- Since ViewportJS is only concerned about the width and height of your viewport, it does not depend `window.matchMedia`.
- [UMD](https://github.com/umdjs/umd) compatible.
- Tested in IE7-11, Safari, Firefox, Chrome, Mobile Safari, Chrome Android (4.2.2).



## Features ##

ViewportJS exposes an API that answers the following questions:

Can I subscribe/unsubscribe to the `name` viewport to receive updates when `name` becomes valid/invalid?

```js
var myToken = myViewport.subscribe( 'name', function( matches, viewport ) {
    // do something
});

myViewport.unsubscribe( myToken );
```

Can I subscribe to all viewports at once?

```js
myViewport.subscribe( '*', function( viewport ) {
    // do something
});
```

Is `name` the current viewport?
  
```js
myViewport.is( 'name' );
```

Which viewport is the current viewport?

```js
myViewport.current();
```

Does `name` fall within the current viewport?

```js
myViewport.matches( 'name' );
```



## Usage ##

The `viewport` function takes an array of viewport objects and returns a new instance of the `Viewport` constructor:

```js
var myViewport = viewport( viewports );
```

The `viewports` argument is an `Array` of viewport objects:

```js
var myViewport = viewport([
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

The `viewports` are made up from an `Array` of 1 or more viewport objects. A viewport object has the following possible properties:


### `name String` ###

The name given to the viewport.
    

### `width Array` ###

The min/max-width `Number` to test. Example:

```js  
width: [ 960 ]      // ( min-width:960px )
width: [ 0, 960 ]   // ( max-width:960px )
width: [ 480, 960 ] // ( min-width:480px ) and ( max-width:960px )
```

### `height Array` ###

The min/max-height `Number` to test. Example:

```js
height: [ 960 ]      // ( min-height:960px )
height: [ 0, 960 ]   // ( max-height:960px )
height: [ 480, 960 ] // ( min-height:480px ) and ( max-height:960px )
```



## Methods ##

### `is( name String )` ###

Checks if the specified viewport is the current viewport. Returns a `boolean`. (See the `current` method for more info on how this is determined.)

```js
var isSmallCurrentVP = myViewport.is( 'small' );

if ( isSmallCurrentVP ) {
    // do something
}
```

### `current()` ###

Checks each viewport and returns the last matching viewport `object` based on the `viewports` array configuration order. So if you prefer a "mobile-first" approach, your `viewports` array should be ordered from smallest to largest. Returns the current `viewport` object.

```js
var currentVP = myViewport.current();
```

### `matches( String name )` ###

Checks if the specified viewport is within the current viewport. Returns a `boolean`.

```js
var isSmallWithinVP = myViewport.matches( 'small' );

if ( isSmallWithinVP ) {
    // do something
}
```

### `subscribe( String name, Function handler )` ###

Subscribe for updates when a specific viewport becomes valid/invalid. The handler is passed the `isCurrent` boolean for checking if the viewport has become valid/invalid, as well as the current viewport's object. All subscribers are checked for validity when first subscribed to allow for lazy subscribers. The `subscribe` method returns a token for use on the `unsubscribe` method.

There is also a reserved viewport name "*" to allow for subscribing to all viewports at once. It's handler only receives the current viewport's object.

```js
var smallVPToken = myViewport.subscribe( 'small', function( isCurrent, viewport ) {
    
    if ( isCurrent ) {
        // do something
    } else {
        // do another thing
    }
});
```

### `unsubscribe( Number token )` ###

Unsubscribe from updates to a specific viewport. Requires the `token` returned from the original subscription.

```js
var smallVPToken = myViewport.subscribe( 'small', function( matches ) {
    // do something
});

myViewport.unsubscribe( smallVP );
```



## Properties ##


### `viewports Array` ###

The original `array` of viewports.


### `vps Object` ###

An object keyed by the viewport names. Extends the original viewport objects with the `test` method, which is created from the `width` and `height` members.



## Testing ##

- Install phantomJS >= 1.9.1
- Run `npm install` to install the required testing modules
- Run the tests: `npm test`



## Credits ##

- [tysonmatanich/viewportSize](https://github.com/tysonmatanich/viewportSize) for the technique on which size property to use (`clientWidth` or `innerWidth`).



## Roadmap ##

- Functional testing. Subscribe feature needs the window size to be manipulated.
