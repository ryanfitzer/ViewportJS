## New Features ##

- Viewport configuration is now done with media query expression strings instead of using arrays of numbers. This enables taking advantage to the full [media query syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/Media_Queries/Using_media_queries).

    ```js
    const myvps = viewport( [
      {
        name: 'small',
        query: '( min-width: 500px )'
      }
    ] );
    ```

- Subscribing to configured viewports can now be done by calling the instance directly, passing the same arguments you'd normally pass to `subscribe( name, handler )`. For example:

    ```js
    const myvps = viewport( /* viewport config array */ );

    // The following syntaxes are equivalent

    myvps.subscribe( 'small', ( state, vps ) => {} );
    myvps( 'small', ( state, vps ) => {} );
    ```

- Skip viewport configuration when you only need to subscribe to a single media query:

    ```js
    const singlevps = viewport( '( min-width: 500px )', state => {} );
    myvps.matches(); // true/false
    myvps.remove(); // removes the handler
    ```

- All configured viewports and subscribers can now be removed at once by call the `remove()` method on the respective instance:

    ```js
    const multivps = viewport( /* viewport config array */ );
    const singlevps = viewport( /* media query */, state => {} );
    multivps.remove();
    singlevps.remove();
    ```


## Enhancements ##

- Subscribing to all configured viewports at once is now done via the new `subscribeAll()`.

    ```js
    const myvps = viewport( /* viewport config array */ );
    myvps.subscribeAll( ( changed, vps ) => {} );
    ```

- The `current()` method now supports a `name` argument and returns a boolean based on the viewport's `current` state. This aligns it with how `matches()` has always behaved.

- API now warns when `subscribe()` or `subscribeAll()` is used in an environment that doesn't support `matchMedia`. This is done to help in preventing memory leaks when used in server-side rendered apps.


## Breaking Changes ##

- Viewport configuration objects now use a `query` property instead of `width` and `height` properties.

- Subscriber handlers now receive the changed viewport's state object, and an array of all configured viewport state objects. For example:

    ```js
    const myvps = viewport( /* viewport config array */ );

    myvps.subscribe( 'small', ( state, vps ) => {

      console.log( state );
      // { name: 'small', matches: boolean, current: boolean }

    } );

    myvps.subscribeAll( ( changed, vps ) => {

      console.log( changed );
      // { name: 'small', matches: boolean, current: boolean }

    } );
    ```

- Subscribers are now executed whenever there's a change in both the viewport's `matched` or `current` state. Previously, this only happened when there was a change to the viewport's `current` state.

- Subscribing to all viewports using the reserved viewport name `*` is no longer supported. The `subscribeAll()` method enables subscribing to changes for all configured viewports.

- Removed `options`. I've have yet to see `delay` used and `units` is no longer needed.

- Removed the `is( name )` method due to the vague nature of what `is` meant. Did it mean `name` was the `current` viewport (yes), or just a `matched` viewport (no)? The same can now be accomplished with `current( name )` and `matches( name )`.


