# ViewportJS #

An unassuming, no-frills tool to use your responsive viewports in JavaScript. Unlike `window.matchMedia`, ViewportJS does not expose an API for subscribing to viewport changes (currently in the works). Instead, ViewportJS provides a simple tool for querying info on your viewports by name.

- Uses [UMD](https://github.com/umdjs/umd).
- No dependency on `window.matchMedia`.



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

- Can I store and retrieve the media query expression for the `name` viewport?

  ```js
  myViewport.get( 'name' ).mediaExp;
  ```

- Can I get [Modernizr](http://modernizr.com/) to add the state of each of my viewports to the `html` tag so I can use them in my stylesheets?

  ```js
  var myViewport = viewport( vpsArray, { modernize: true } );
  ```



## Usage ##

The `viewport` function takes two arguments and returns a new instance of the `Viewport` constructor:

```js
var myViewport = viewport( viewports, options );
```

- `viewports Array` An array of viewport definition objects.

- `options Object`  
    - `debug Boolean`: log to the console information on each viewport. Defaults to `false`.
    - `modernize Boolean`: Add each viewport as a test in Modernizr (if available). Defaults to `false`.

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

### `condition Function` ###

(Optional) Useful if your viewport test requires more than just width and/or height. Must return a `boolean`. Example:

```js
condition: function() {
    return Modernizr.touch;
}
```

### `mediaExp String` ###

(Optional) The media expression associated with the viewport. Helpful if you're using `window.matchMedia` and want a single place to store your media expressions. Example:

```js
var smallMQ = myViewport.get( 'small' ).mediaExp;

if ( window.matchMedia( smallMQ ).matches ) {
    // do something
}
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

Checks each viewport condition and returns the first matching viewport `object` based on the `viewports` array configuration order. So if you prefer a "mobile-first" approach, your `viewports` array should be ordered from smallest viewport to the largest.

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

- Create an API for subscribing to a viewport channel that publishes when a viewport goes in/out of a matching/current state.
