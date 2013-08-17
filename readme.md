# ViewportJS #

A no-frills way to manage your responsive viewports in JavaScript.



## Usage ##

Configure with an `array` of viewport objects:

```js
var myViewport = viewports([
    {
        name: 'small',
        mediaExp: '( min-width:480px )',
        condition: function() {
            return document.documentElement.clientWidth >= 480;
        }
    },
    {
        name: 'medium',
        mediaExp: '( min-width:768px )',
        condition: function() {
            return document.documentElement.clientWidth >= 768;
        }
    },
    {
        name: 'large',
        mediaExp: '( min-width:1024px )',
        condition: function() {
            return document.documentElement.clientWidth >= 1024;
        }
    }
]);
```

Branch functionality based on the current viewport:

```js
if ( myViewports.is( 'large' ) ) {
    // do something
} else {
    // do something else
}
```

Use the viewport's media expression with `window.matchMedia`:

```js
if ( window.matchMedia( myViewports.get( 'large' ).mediaExp ).matches ) {
    // do something
} else {
    // do something else
}
```

## Viewport Object ##

A viewport object has the following properties. Also, if Modernizr is available, the `name` and `condition` are used to add a new test via `Modernizr.addTest()`.

`name`
: [String] The name given to the viewport.

`mediaExp`
: [String] An optional media expression associated with the viewport. Helpful if you're using `window.matchMedia` and want a single place to store your media expressions.

`condition`
: [Function] A function to test the viewport. Must return a `boolean`.



## Methods ##


### `get` ###

Returns a viewport `object`.

```js
myViewports.get( 'small' );
```


### `is` ###

Executes the viewport's `condition` function and returns a `boolean`.

```js
myViewports.is( 'small' );
```


### `current` ###

Checks each viewport condition (in the original configuration order) and returns the current viewport `object`.

```js
myViewports.current();
```



## Properties ##


### `viewports` ###

The original `array` of viewports.


### `vps` ###

An object keyed by the viewport names.