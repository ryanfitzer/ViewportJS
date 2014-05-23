# ViewportJS #

An unassuming, no-frills tool to use your responsive viewports in JavaScript. ViewportJS exposes an API for querying and/or subscribing to viewport changes.

- Uses [UMD](https://github.com/umdjs/umd).
- No dependency on `window.matchMedia`.
- Tested in IE7-11, Safari, Firefox, Chrome, Mobile Safari, Chrome Android (4.2.2)



## Features ##

ViewportJS exposes an API that answers the following questions:

- Is `name` the current viewport?
  
  ```js
  myViewport.is( 'name' );
  ```

- Which viewport is the current viewport?

  ```js
  myViewport.current();
  ```

- Does `name` fall within the current viewport?

  ```js
  myViewport.matches( 'name' );
  ```

- Can I subscribe/unsubscribe to the `name` viewport to receive updates when `name` becomes valid/invalid?

  ```js
  var myToken = myViewport.subscribe( 'name', function( matches ) {
      // do something
  });
  myViewport.unsubscribe( myToken );
  ```


## Usage ##

The `viewport` function takes two arguments and returns a new instance of the `Viewport` constructor:

```js
var myViewport = viewport( viewports );
```

- `viewports Array` An array of viewport definition objects.

---

The `viewports` argument is an `Array` of viewports:

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

The object returned to `myViewport` can now be used to branch functionality based on the current viewport:

```js
if ( myViewport.is( 'large' ) ) {
    // do something
} else {
    // do something else
}
```

You can also subscribe/unsubscribe to a specific for updates when it becomes valid/invalid.

```js
var largeVPToken = myViewport.subscribe( 'large', function( isCurrent ) {
    // do something
});

myViewport.unsubscribe( largeVPToken );
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

Checks if the specified viewport is the current viewport. Returns a `boolean`. See the `current` method for more info on how this is determined.

```js
var isSmallCurrentVP = myViewport.is( 'small' );

if ( isSmallCurrentVP ) {
    // do something
}
```

### `current()` ###

Checks each viewport condition and returns the last matching viewport `object` based on the `viewports` array configuration order. So if you prefer a "mobile-first" approach, your `viewports` array should be ordered from smallest viewport to the largest.

```js
var currentVP = myViewport.current();
```


### `get( name String )` ###

Returns the specified viewport `object`.

```js
var smallVP = myViewport.get( 'small' );
```

### `matches( String name )` ###

Checks if the specified viewport is within the current viewport. The `matches` method differs from `is` by only testing the specified viewport. Returns a `boolean`.

```js
var isSmallWithinVP = myViewport.matches( 'small' );

if ( isSmallWithinVP ) {
    // do something
}
```

### `subscribe( String name, Function handler )` ###

Subscribe for updates when a specific viewport becomes valid/invalid. The handler is passed a `isCurrent` boolean for checking if the viewport has become valid/invalid. The `subscribe` method returns a token for unsubscribing.

```js
var smallVPToken = myViewport.subscribe( 'small', function( isCurrent ) {
    
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

An object keyed by the viewport names. Extends the original viewport objects with the `test` method, which is created from the `width`, `height` and `condition` members.



## Testing ##

- Install phantomJS >= 1.9.1
- Run `npm install` to install the required testing modules
- Run the tests: `npm test`



## Credits ##

- [tysonmatanich/viewportSize](https://github.com/tysonmatanich/viewportSize) for the technique on which size property to use (`clientWidth` or `innerWidth`).



## Roadmap ##

- Testing on more devices.
- Enhanced unit testing. Unit tests need to be done for all browsers, not just WebKit. Subscribe feature needs the window size to be manipulated. PhantomJS does not offer this. 
