# ViewportJS #

A unassuming, no-frills tool to use your responsive viewports in JavaScript.



## Features ##

ViewportJS exposes an API that answers the following questions:

- Is `name` the current viewport?

- What's the current viewport?

- Does `name` fall within the current viewport?

- Can I get the media query expression for the `name` viewport?

- Can I get [Modernizr](http://modernizr.com/) to add the state of each of my viewports to the `html` tag so I can use them in my stylesheets?



## Usage ##

Configure with an `array` of viewport objects:

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

Branch functionality based on the current viewport:

```js
if ( myViewport.is( 'large' ) ) {
    // do something
} else {
    // do something else
}
```



## Viewport Object ##

A viewport object has the following properties:

### `name (String)` ###

The name given to the viewport.
    

### `width (Array)` ###

The min/max-width `Number` to test. Example:

```js  
width: [ 960 ]      // ( min-width:960px )
width: [ 0, 960 ]   // ( max-width:960px )
width: [ 480, 960 ] // ( min-width:480px ) and ( max-width:960px )
```

### `height (Array)` ###

The min/max-height `Number` to test. Example:

```js
height: [ 960 ]      // ( min-height:960px )
height: [ 0, 960 ]   // ( max-height:960px )
height: [ 480, 960 ] // ( min-height:480px ) and ( max-height:960px )
```

### `condition (Function)` ###

(Optional) Useful if your viewport test requires more than just width and/or height. Must return a `boolean`. Example:

```js
condition: function() {
    return Modernizr.touch;
}
```

### `mediaExp (String)` ###

(Optional) The media expression associated with the viewport. Helpful if you're using `window.matchMedia` and want a single place to store your media expressions. Example:

```js
var smallMQ = myViewport.get( 'small' ).mediaExp;

if ( window.matchMedia( smallMQ ).matches ) {
    // do something
}
```


## Methods ##

### `is( String name )` ###

Checks if the specified viewport is the current viewport. Returns a `boolean`.

```js
var isSmallCurrentVP = myViewport.is( 'small' );

if ( isSmallCurrentVP ) {
    // do something
}
```

### `current()` ###

Checks each viewport condition (in the original configuration order) and returns the last matching viewport `object`.

```js
var currentVP = myViewport.current();
```


### `get( String name )` ###

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


### `viewports (Array)` ###

The original `array` of viewports.


### `vps (Object)` ###

An object keyed by the viewport names. Extends the original viewport objects with the `test` method, which is created from the `width`, `height` and `condition` members.



## Testing ##

- Install phantomJS >= 1.9.1
- Run `npm install` to install the required testing modules
- Run the tests: `npm test`



## Credits ##

- [tysonmatanich/viewportSize](https://github.com/tysonmatanich/viewportSize) for the technique on which size property to use (`clientWidth` or `innerWidth`).



## Roadmap ##

- Cache queries if viewport hasn't changed since last query (would require a listener to invalidate cache).
