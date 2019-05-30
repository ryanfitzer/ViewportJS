# Migrating to v3.0.0 #



## New Features ##

- Viewport configuration is now done with media query expression strings instead of using arrays of numbers. This enables taking advantage to the full [media query syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries).

    ```js
    const myvps = viewport( [
      {
        name: 'small',
        query: '( max-width: 500px )'
      },
      {
        name: 'medium',
        query: '( min-width: 501px ) and ( max-width: 768px )'
      },
      {
        name: 'large',
        query: '( min-width: 769px )'
      }
    ] );
    ```

- You can now subscribe directly to a media query by skipping the viewport configuration. This is helpful when you're only interested in a single breakpoint:

    ```js
    const smallvp = viewport( '( max-width: 500px )', state => {} );
    smallvp.matches(); // true/false
    smallvp.remove(); // remove the handler
    ```

- You can now remove all configured viewports and subscribers associated with an instance all at once by calling the `remove()` method on the respective instance:

    ```js
    const myvps = viewport( /* viewport config array */ );
    myvps( 'name1', state => {} );
    myvps( 'name2', state => {} );
    myvps.remove(); // The handlers and configuration for `'name1'` and `'name1'` have been removed.
    ```


## Enhancements ##

- Subscribing to configured viewports is now done by calling the instance directly. For an individual configured viewport, both `name` and `handler` are required. Passing only `handler` will subscribe to all viewports. For example:

    ```js
    const myvps = viewport( /* viewport config array */ );

    // Individual configured viewport
    const unsubscribeSmall = myvps( 'small', ( state, vps ) => {} );
    unsubscribeSmall() // remove the handler

    // All configured viewports
    const unsubscribeAll = myvps( ( state, vps ) => {} );
    unsubscribeAll() // remove the handler
    ```

- Subscriber handlers now receive the changed viewport's state object and the configured instance. For example:

    ```js
    const myvps = viewport( /* viewport config array */ );
    
    // Individual configured viewport
    myvps( 'small', ( state, instance ) => {

      console.log( state );
      // { name: 'small', matches: boolean, current: boolean }

      console.log( instance );
      // myvps

    } );
    
    // All configured viewports
    myvps.subscribeAll( ( changed, instance ) => {

      console.log( changed );
      // { name: 'small', matches: boolean, current: boolean }

    } );
    ```

- Subscribers are now executed whenever there's a change in either the viewport's `matched` or `current` state. Previously, this only happened when there was a change to the viewport's `current` state.

- Added a `state()` method the returns an array of state objects for the configured viewports of the respective instance. When called with a `name` argument, it returns a state object for the named configured viewport.

- The `current()` method now supports a `name` argument and returns a boolean based on the viewport's `current` state. This aligns it with how `matches()` has always behaved.

- The Node API now warns when a subscription is attempted in an environment that doesn't support `matchMedia`. This is done to help in preventing memory leaks when used in server-side rendered apps.


## Breaking Changes ##

- Viewport configuration objects now use a `query` property instead of `width` and `height` properties.

- Subscriber handlers receive different arguments: the changed viewport's state object and the configured instance.

- The `subscribe` method has been replaced by calling the instance directly.

- Subscribers are now executed whenever there's a change in either the viewport's `matched` or `current` state. Previously, this only happened when there was a change to the viewport's `current` state.

- Subscribing to all viewports using the reserved viewport name `*` has been replaced by calling the instance directly and passing a `handler`.

- The instance properties `vps` and `viewports` have been removed. An array of state objects for the configured viewports can be retrieved by calling the `state()` method of the respective instance.

- Access to the each configured viewport's `MediaQueryList` object is no longer available.

- Removed `options`. I've have yet to see `delay` used and `units` is no longer needed.

- Removed the `is( name )` method due to the vague nature of what `is` meant. Did it mean `name` was the `current` viewport (yes), or just a `matched` viewport (no)? The same can now be accomplished with `current( name )` and `matches( name )`.


