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
        'state',
        'remove',
        'matches',
        'current',
        'previous'
    ];

    function getLogMessage( label, subs ) {

        subs = subs || {};

        var msg = {
            subNoSupport: '[viewportjs] Subscribing to a viewport in this environment can cause memory leaks.',
            subNoConfig: '[viewportjs] Subscriber failed to be added. Instance does not have a configuration.',
            queryNoConfig: '[viewportjs] The `' + subs + '()` method failed. Instance does not have a configuration.',
            noHandler: '[viewportjs] The `' + subs.method + '()` method failed. Instance for query `' + subs.query + '`, was configured without a `handler`.',
            subNoName: '[viewportjs] Subscriber failed to be added. The name `' + subs + '` does not match any configured viewports.'
        };

        return msg[ label ];

    }

    function copyViewportObject( vp ) {

        return {
            name: vp.name,
            matches: vp.matches,
            current: vp.current
        };

    }

    function ensureViewportObject( name, vps ) {

        if ( vps && vps[ name ] ) return copyViewportObject( vps[ name ] );

        return {
            name: undefined,
            matches: false,
            current: false
        };

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

                console.warn( getLogMessage( 'noHandler', {
                    query: query,
                    method: 'remove'
                } ) );

            },
            matches: function () {

                return mql.matches;

            }
        };

        if ( !handler ) return api;

        var listener = function ( event ) {

            handler( {
                matches: event.matches
            }, api );

        };

        mql.addListener( listener );

        if ( mql.matches ) listener( mql.matches, api );

        api.remove = mql.removeListener.bind( mql, listener );

        return api;

    }

    function Viewport( viewports ) {

        this.api = null;
        this.viewports = viewports;
        this.store = {
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

            this.store.channels[ vp.name ] = [];

            this.store.vps[ vp.name ] = {
                name: vp.name,
                matches: false,
                current: false
            };

        }, this );

        this.setState();

    }

    Viewport.prototype = {

        getMatches: function () {

            return ( this.viewports || [] ).filter( function ( vp ) {

                return vp.mql.matches;

            } ).map( copyViewportObject );

        },

        getCurrent: function () {

            var match = this.getMatches().pop();

            return match ? match.name : undefined;

        },

        getChanges: function ( viewport, current ) {

            var name = viewport.name;
            var state = this.store.vps[ name ];
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
            var current = ensureViewportObject( this.getCurrent(), this.store.vps );

            this.viewports.forEach( function ( viewport ) {

                var vp = this.store.vps[ viewport.name ];
                var changes = this.getChanges( viewport, current );

                changes.forEach( function ( change ) {

                    vp[ change.key ] = change.value;

                } );

                if ( changes.length ) changed.push( vp.name );

            }, this );

            if ( current.name !== this.store.current ) {

                this.store.previous = this.store.current;
                this.store.current = current.name;

            }

            changed.forEach( this.publish, this );

        },

        addSubscriber: function ( opts ) {

            var token = this.store.tokenUid = this.store.tokenUid + 1;

            opts.channel.push( {
                token: token,
                handler: opts.handler
            } );

            opts.changed.forEach( function ( vp ) {

                opts.handler( vp, this.api );

            }, this );

            return createUnsubscribe( token, opts.channel );

        },

        subscribe: function ( name, handler ) {

            var vp = this.store.vps[ name ];

            return this.addSubscriber( {
                handler: handler,
                channel: this.store.channels[ name ],
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
                channel: this.store.channelAll,
                changed: current.name ? matches.concat( current ) : []
            } );

        },

        publish: function ( name ) {

            this.store.channels[ name ].forEach( function ( subscriber ) {

                subscriber.handler( this.store.vps[ name ], this.api );

            }, this );

            this.store.channelAll.forEach( function ( subscriber ) {

                subscriber.handler( this.store.vps[ name ], this.api );

            }, this );

        },

        state: function ( name ) {

            console.assert( this.viewports, getLogMessage( 'queryNoConfig', 'state' ) );

            if ( name ) return ensureViewportObject( name, this.store.vps );

            return Object.keys( this.store.vps || {} ).map( function ( label ) {

                return ensureViewportObject( label, this.store.vps );

            }, this );

        },

        matches: function ( name ) {

            console.assert( this.viewports, getLogMessage( 'queryNoConfig', 'matches' ) );

            if ( name ) return ensureViewportObject( name, this.store.vps ).matches;

            return this.getMatches();

        },

        current: function ( name ) {

            console.assert( this.viewports, getLogMessage( 'queryNoConfig', 'current' ) );

            var current = ensureViewportObject( this.store.current, this.store.vps );

            if ( name ) return current.name === name;

            return current;

        },

        previous: function ( name ) {

            console.assert( this.viewports, getLogMessage( 'queryNoConfig', 'previous' ) );

            if ( name ) return this.store.previous === name;

            return ensureViewportObject( this.store.previous, this.store.vps );

        },

        remove: function () {

            console.assert( this.viewports, getLogMessage( 'queryNoConfig', 'remove' ) );

            this.viewports.forEach( function ( viewport ) {

                viewport.mql.removeListener( viewport.listener );

            } );

            return this.viewports = this.store.vps = this.store.current = this.store.previous = null;

        }

    };

    function module( config, handler ) {

        // Subscribe to a single media query
        if ( typeof config === 'string' ) return staticSubscribe( config, handler );

        var instance = new Viewport( config );

        instance.api = function ( first, second ) {

            console.assert( instance.viewports, getLogMessage( 'subNoConfig' ) );

            // Subscribe to a single configured viewport
            if ( typeof first === 'string' ) {

                console.assert( instance.store.vps[ first ], getLogMessage( 'subNoName', first ) );

                return instance.subscribe.call( instance, first, second );

            }

            // Subscribe to all configured viewports
            return instance.subscribeAll.call( instance, first );

        };

        return exposedAPI.reduce( function ( accum, method ) {

            accum[ method ] = instance[ method ].bind( instance );

            return accum;

        }, instance.api );

    }

    // Create noop API for use in Node
    if ( typeof window === 'undefined' || typeof window.matchMedia === 'undefined' ) {

        return function () {

            var noop = function () {};
            var warn = function () {

                console.warn( getLogMessage( 'subNoSupport' ) );

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