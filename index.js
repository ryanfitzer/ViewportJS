/* ! ViewportJS github.com/ryanfitzer/ViewportJS/blob/master/LICENSE */
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

}
( this, function () {

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

    function copyViewportObject( vp ) {

        return {
            name: vp.name,
            matches: vp.matches,
            current: vp.current
        };

    }

    function createMediaQueryList( query, listener ) {

        var mql = window.matchMedia( query );

        mql.addListener( listener );

        return mql;

    }

    function Viewport( viewports ) {

        this.viewports = viewports;
        this.aliases = {};
        this.state = {
            vps: {},
            tokenUid: -1,
            channels: {},
            current: undefined,
            previous: undefined
        };

        this.viewports.forEach( function ( vp ) {

            this.aliases[ vp.name ] = this.subscribe.bind( this, vp.name );

            vp.listener = this.setState.bind( this );
            vp.mql = createMediaQueryList( vp.query, vp.listener );

            this.state.channels[ vp.name ] = [];

            this.state.vps[ vp.name ] = {
                name: vp.name,
                matches: false,
                current: false
            };

        }, this );

        this.setState();

    }

    Viewport.prototype = {

        ensureViewportObject: function ( name ) {

            if ( this.state.vps[ name ] ) return copyViewportObject( this.state.vps[ name ] );

            return {
                name: undefined,
                matches: false,
                current: false
            };

        },

        validateViewportName: function ( name ) {

            if ( !this.state.vps[ name ] ) {

                throw new Error( 'The viewport "' + name + '" does not match any configured viewports.' );

            }

        },

        matches: function ( name ) {

            if ( name ) return this.state.vps[ name ].matches;

            return this.getMatches();

        },

        getMatches: function () {

            return this.viewports.filter( function ( vp ) {

                return vp.mql.matches;

            } ).map( copyViewportObject );

        },

        current: function ( name ) {

            if ( name ) return this.state.current === name;

            return this.ensureViewportObject( this.state.current );

        },

        getCurrent: function () {

            var match = this.getMatches().pop();

            return match ? match.name : undefined;

        },

        previous: function ( name ) {

            if ( name ) return this.state.previous === name;

            return this.ensureViewportObject( this.state.previous );

        },

        subscribe: function ( name, handler ) {

            this.validateViewportName( name );

            var vp = this.state.vps[ name ];
            var token = this.state.tokenUid = this.state.tokenUid + 1;

            this.state.channels[ name ].push( {
                token: token,
                handler: handler
            } );

            if ( vp.current || vp.matches ) handler( vp );

            return this.unsubscribe( token, name );

        },

        unsubscribe: function ( token, name ) {

            return function () {

                this.state.channels[ name ].forEach( function ( subscriber, index ) {

                    if ( subscriber.token === token ) this.state.channels[ name ].splice( index, 1 );

                } );

            };

        },

        subscribeAll: function ( name, method ) {

        },

        unsubscribeAll: function ( subscribers, token ) {

        },

        getChanges: function ( viewport, current ) {

            var name = viewport.name;
            var state = this.state.vps[ name ];
            var props = {
                matches: viewport.mql.matches,
                current: current.name === name
            };

            return Object.keys( props ).reduce( function ( accum, label ) {

                if ( state[ label ] !== props[ label ] ) {

                    accum.push( {
                        key: label,
                        value: props[ label ]
                    } );

                }

                return accum;

            }, [] );

        },

        setState: function () {

            var changed = [];
            var current = this.ensureViewportObject( this.getCurrent() );

            this.viewports.forEach( function ( viewport ) {

                var vp = this.state.vps[ viewport.name ];
                var changes = this.getChanges( viewport, current );

                changes.forEach( function ( change ) {

                    vp[ change.key ] = change.value;

                } );

                if ( changes.length ) changed.push( vp.name );

            }, this );

            if ( current.name !== this.state.current ) {

                this.state.previous = this.state.current;
                this.state.current = current.name;

            }

            changed.forEach( this.publish, this );

        },

        publish: function ( name ) {

            this.state.channels[ name ].forEach( function ( subscriber ) {

                subscriber.handler( this.state.vps[ name ] );

            }, this );

        }

    };

    return function ( viewports ) {

        var instance = new Viewport( viewports );

        var api = {
            matches: instance.matches.bind( instance ),
            current: instance.current.bind( instance ),
            previous: instance.previous.bind( instance ),
            subscribe: instance.subscribe.bind( instance ),
            subscribeAll: instance.subscribeAll.bind( instance )
        };

        for ( var name in instance.aliases ) {

            if ( api[ name ] ) return console.warn( '[viewportjs] Defining the viewport name "' + name + '" as an alias to `subscribe` failed.' );

            api[ name ] = instance.aliases[ name ];
        }

        return api;

    };

} ) );