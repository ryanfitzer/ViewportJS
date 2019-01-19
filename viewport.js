/* !ViewportJS github.com/ryanfitzer/ViewportJS/blob/master/LICENSE */
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

    var exposedAPI = [
        'remove',
        'matches',
        'current',
        'previous',
        'subscribe',
        'subscribeAll'
    ];

    function copyViewportObject( vp ) {

        return {
            name: vp.name,
            matches: vp.matches,
            current: vp.current
        };

    }

    function copyViewportObjects( vps ) {

        var result = [];

        for ( var vp in vps ) result.push( copyViewportObject( vps[ vp ] ) );

        return result;

    }

    function createMediaQuery( query, listener ) {

        var mql = window.matchMedia( query );

        mql.addListener( listener );

        return mql;

    }

    function createUnsubscribe( token, channel ) {

        return function () {

            channel = channel.filter( function ( subscriber ) {

                subscriber.token !== token;

            } );

            return token;

        };

    }

    function staticSubscribe( query, handler ) {

        var mql = window.matchMedia( query );
        var api = {
            remove: function () {

                console.warn( '[viewportjs] The `remove()` method was called for the query "' + query + '", but a handler was never originally provided.' );

            },
            matches: function () {

                return mql.matches;

            }
        };

        if ( !handler ) return api;

        var listener = function ( event ) {

            handler( {
                matches: event.matches
            } );

        };

        mql.addListener( listener );

        if ( mql.matches ) listener( mql.matches );

        api.remove = mql.removeListener.bind( mql, listener );

        return api;

    }

    function Viewport( viewports ) {

        this.viewports = viewports;
        this.state = {
            vps: {},
            tokenUid: -1,
            channels: {},
            channelAll: [],
            current: undefined,
            previous: undefined
        };

        this.viewports.forEach( function ( vp ) {

            vp.listener = this.setState.bind( this );
            vp.mql = createMediaQuery( vp.query, vp.listener );

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

        getMatches: function () {

            return this.viewports.filter( function ( vp ) {

                return vp.mql.matches;

            } ).map( copyViewportObject );

        },

        getCurrent: function () {

            var match = this.getMatches().pop();

            return match ? match.name : undefined;

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

        addSubscriber: function ( opts ) {

            var vps = copyViewportObjects( this.state.vps );
            var token = this.state.tokenUid = this.state.tokenUid + 1;

            opts.channel.push( {
                token: token,
                handler: opts.handler
            } );

            opts.changed.forEach( function ( vp ) {

                opts.handler( vp, vps );

            } );

            return createUnsubscribe( token, opts.channel );

        },

        publish: function ( name ) {

            this.state.channels[ name ].forEach( function ( subscriber ) {

                subscriber.handler( this.state.vps[ name ] );

            }, this );

            this.state.channelAll.forEach( function ( subscriber ) {

                subscriber.handler( this.state.vps[ name ], copyViewportObjects( this.state.vps ) );

            }, this );

        },

        matches: function ( name ) {

            if ( name ) return this.state.vps[ name ].matches;

            return this.getMatches();

        },

        current: function ( name ) {

            if ( name ) return this.state.current === name;

            return this.ensureViewportObject( this.state.current );

        },

        previous: function ( name ) {

            if ( name ) return this.state.previous === name;

            return this.ensureViewportObject( this.state.previous );

        },

        subscribe: function ( name, handler ) {

            var vp = this.state.vps[ name ];

            if ( !vp ) return console.warn( '[viewportjs] Subscription failed. The viewport "' + name + '" does not match any configured viewports.' );

            return this.addSubscriber( {
                handler: handler,
                channel: this.state.channels[ name ],
                changed: ( vp.current || vp.matches ) ? [ vp ] : []
            } );

        },

        subscribeAll: function ( handler ) {

            var current = this.current();
            var matches = this.matches().filter( function ( vp ) {

                return vp.name !== current.name;

            } );

            return this.addSubscriber( {
                handler: handler,
                channel: this.state.channelAll,
                changed: current.name ? matches.concat( current ) : []
            } );

        },

        remove: function () {

            this.viewports.forEach( function ( viewport ) {

                viewport.mql.removeListener( viewport.listener );

            } );

            this.viewports = this.state = null;

        }

    };

    function module( config, handler ) {

        if ( !Array.isArray( config ) ) return staticSubscribe( config, handler );

        var instance = new Viewport( config );

        var api = function ( first, second ) {

            if ( typeof first === 'string' ) return instance.subscribe.call( instance, first, second );

            return instance.subscribeAll.call( instance, first );

        };

        return exposedAPI.reduce( function ( api, method ) {

            api[ method ] = instance[ method ].bind( instance );

            return api;

        }, api );

    }

    if ( typeof window === 'undefined' || typeof window.matchMedia === 'undefined' ) {

        return function () {

            var noop = function () {};
            var warn = function () {

                console.warn( '[viewportjs] Subscribing to a viewport in this environment can cause memory leaks.' );

            };

            return exposedAPI.reduce( function ( api, method ) {

                if ( 'subscribe'.test( method ) ) api[ method ] = warn;
                else api[ method ] = noop;

                return api;

            }, {} );

        };

    }

    return module;

} ) );