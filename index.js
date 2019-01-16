/* ! ViewportJS github.com/ryanfitzer/ViewportJS/blob/master/LICENSE */
'use strict';
( function ( root, factory ) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define( [], factory );

    }
    else if ( typeof module === 'object' && module.exports ) {

        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();

    }
    else {

        // Browser globals (root is window)
        root.viewport = factory();

    }

}( this, function () {

    // Stub API for handling server-side rendering.
    if ( typeof window === 'undefined' || typeof window.matchMedia === 'undefined' ) {

        return function () {

            var noop = function () {};
            var warn = function () {

                console.warn( '[viewportjs] Subscribing to a viewport in this environment can cause memory leaks.' );

            };

            return {
                matches: noop,
                current: noop,
                previous: noop,
                subscribe: warn,
                subscribeAll: warn
            };

        };

    }

    // Undefined viewport object to use when no queries match.
    // var undefinedViewport = {
    //     name: undefined,
    //     matches: undefined,
    //     current: undefined
    // };

    function createMediaQueryList( query, listener ) {

        var mql = window.matchMedia( query );

        mql.addListener( listener );

        return mql;

    }

    function Viewport( viewports ) {

        this.viewports = viewports;
        this.state = {
            vps: {},
            tokenUid: -1,
            channels: {},
            subscribers: {},
            current: undefined,
            previous: undefined
        };

        this.viewports.forEach( function ( vp, index ) {

            vp.listener = this.setState.bind( this, vp );
            vp.mql = createMediaQueryList( vp.query, vp.listener );

            this.state.vps[ vp.name ] = {
                name: vp.name,
                matches: false,
                current: false
            };

        }, this );

        this.viewports.forEach( function ( vp, index ) {

            vp.listener();

        } );

    }

    Viewport.prototype = {

        matches: function ( name ) {

        },

        current: function ( name ) {

            if ( name ) return this.state.current === name;

            var match = this.viewports.filter( function ( vp ) {

                return vp.mql.matches;

            } ).pop();

            return match || {
                name: undefined,
                matches: undefined,
                current: undefined
            };

        },

        previous: function () {

        },

        subscribe: function ( name, method ) {

        },

        subscribeAll: function ( name, method ) {

        },

        unsubscribe: function ( subscribers, token ) {

        },

        unsubscribeAll: function ( subscribers, token ) {

        },

        setState: function ( viewport ) {

            var name = viewport.name;
            var isChanged = false;
            var current = this.current();
            var isCurrent = current.name === name;
            var vpState = this.state.vps[ name ];

            if ( vpState.current !== isCurrent || vpState.matches !== viewport.matches ) isChanged = true;

            vpState.current = isCurrent;
            vpState.matches = viewport.mql.matches;

            if ( isCurrent && this.state.current !== name ) {

                this.state.previous = this.state.current;
                this.state.current = name;

            }
            else if ( !isCurrent && this.state.current === name ) {

                this.state.previous = this.state.current;
                this.state.current = current.name;

            }

            if ( isChanged ) this.publish( name );

        },

        publish: function ( name ) {

            console.log( '[publish]', name );

        }

    };

    return function ( viewports ) {

        var instance;

        instance = new Viewport( viewports );

        return {
            vps: instance.vps,
            matches: instance.matches.bind( instance ),
            current: instance.current.bind( instance ),
            previous: instance.previous.bind( instance ),
            subscribe: instance.subscribe.bind( instance ),
            unsubscribe: instance.unsubscribe.bind( instance ),
            subscribeAll: instance.subscribeAll.bind( instance ),
            unsubscribeAll: instance.unsubscribeAll.bind( instance )
        };

    };

} ) );