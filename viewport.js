/*! ViewportJS 1.0.3 | github.com/ryanfitzer/ViewportJS/blob/master/LICENSE */
;(function ( root, factory ) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define( factory );

    } else {

        // Browser global
        root.viewport = factory();
    }

}( this, function() {

    // Default viewport object to use when no queries match.
    var vpEmpty = {
        name: undefined,
        width: [],
        height: []
    };

    // Test for window.matchMedia
    var hasMatchMedia = !!window.matchMedia;
    // Save instances when window.matchMedia not supported
    var instances = [];
    // Cache vieport size when window.matchMedia is not supported
    var vpSize = {};

    if ( !hasMatchMedia ) {

        /**
         * Get the current viewport dimensions.
         */
        function setVPSize() {

            return vpSize = {
                width: window.innerWidth,
                height: window.innerHeight
            };
        }

        /**
         * Test a viewport's query.
         */
        function isVPMatch( vp ) {

            var wmin = true
                , wmax = true
                , hmin = true
                , hmax = true
                ;

            if ( vp.width ) {

                wmin = vpSize.width >= vp.width[0];
                wmax = vp.width[1] ? vpSize.width <= vp.width[1] : true;
            }

            if ( vp.height ) {

                hmin = vpSize.height >= vp.height[0];
                hmax = vp.height[1] ? vpSize.height <= vp.height[1] : true;
            }

            return wmin && wmax && hmin && hmax;
        }

        /**
         * Update the `matches` property for all viewport queries.
         */
        function updateQueries( delay ) {

            var timer;

            delay = isNaN( delay ) ? 100 : delay;

            return function () {

                timer = throttle( function () {

                    setVPSize();

                    instances.forEach( function ( instance ) {

                        instance.viewports.forEach( function ( vp ) {

                            instance.vps[ vp.name ].mql.matches = isVPMatch( vp );
                        });

                        instance.update();
                    });

                }, timer, delay );
            }
        }

        window.addEventListener( 'resize', updateQueries() );
        window.addEventListener( 'orientationchange', updateQueries() );
    }

    /**
     * Throttle
     */
    function throttle( method, timer, delay ) {

        clearTimeout( timer );

        return setTimeout( function() {

            method();

        }, delay );
    }

    /**
     * Create a full media expression string from width and height dimensions.
     */
    function createExpression( vp, units ) {

        var mqls = []
            , expTmpl = '({prefix}{dimension}:{num}' + units + ')'
            ;

        var prefix = [
            'min-',
            'max-'
        ];

        var mqls = Object.keys( vp ).reduce( function ( acc, dimension ) {

            var expressions = [];

            vp[ dimension ].forEach( function ( num, index ) {
                expressions.push(
                    expTmpl.replace( '{prefix}', prefix[ index ] )
                    .replace( '{dimension}', dimension )
                    .replace( '{num}', num )
                );
            });

            acc.push( expressions.join( ' and ' ) );

            return acc;

        }, [] );

        return mqls.join( ' and ' );
    }

    /**
     * Creates a `mediaQueryList` object.
     *
     * If `window.matchMedia` is not supported (IE9), the object only contains the `matches` property.
     */
    function createMediaQueryList( dimensions, units, listener ) {

        var mql;

        if ( hasMatchMedia ) {

            mql = window.matchMedia( createExpression( dimensions, units ) );
            mql.addListener( listener );

            return mql;
        }

        return {
            matches: false
        };
    };

    /**
     * Viewport constructor.
     */
    function Viewport( viewports, options ) {

        var self = this;

        this.vps = {};
        this.viewports = viewports;
        this.options = options;
        this.state = {
            tokenUid: -1,
            channels: {},
            subscribers: {},
            present: vpEmpty,
            previous: vpEmpty
        };

        viewports.forEach( function ( vp, index ) {

            var timer
                , vpObj = self.vps[ vp.name ] = {}
                ;

            var dimensions = Object.keys( vp ).reduce( function ( acc, key ) {

                if ( !/name/.test( key ) ) {
                    acc[ key ] = vp[ key ];
                }

                return acc;

            }, {} );

            vpObj.name = vp.name;
            vpObj.mql = createMediaQueryList( dimensions, self.options.units, function( e ) {

                timer = throttle( self.update.bind( self ), timer, self.options.delay );
            });
        });
    }

    /**
     * Viewport prototype.
     */
    Viewport.prototype = {

        /**
         * Get the current viewport.
         */
        current: function() {

            var match = this.viewports.filter( function ( vp ) {

                return this.vps[ vp.name ] && this.vps[ vp.name ].mql.matches;

            }, this ).pop();

            return this.vps[ match && match.name ] || vpEmpty;
        },

        /**
         * Check a specific viewport against the current viewport.
         */
        is: function( name ) {

            return this.current().name === name;
        },

        /**
         * Check if a specific viewport matches.
         */
        matches: function( name ) {

            return this.vps[ name ] && this.vps[ name ].mql.matches;
        },

        /**
         * Subscribe to a particular viewport.
         */
        subscribe: function( name, method ) {

            var subscribers;

            if ( !( name in this.vps ) && name !== '*' ) {
                throw new Error( 'The viewport "' + name + '" does not match any configured viewports.' );
            }

            this.state.tokenUid = this.state.tokenUid + 1;

            if ( !this.state.channels[ name ] ) {
                this.state.channels[ name ] = [];
            }

            subscribers = this.state.channels[ name ];

            subscribers.push({
                token: this.state.tokenUid,
                method: method
            });

            // Execute matches immediately to enable lazy subscribers.
            if ( name === this.state.present.name ) method( true, this.state.present );

            // The "*" channel is always fired.
            if ( name === '*' && (this.state.previous.name || this.state.present.name) ) {
                method( this.state.present, this.state.previous );
            }
            // if ( name === '*' ) method( this.state.present, this.state.previous );

            return this.state.tokenUid;
        },

        /**
         * Unsubscribe from a particular viewport.
         */
        unsubscribe: function( token ) {

            var subscribers;

            for ( var name in this.state.channels ) {

                subscribers = this.state.channels[ name ];

                if ( !subscribers ) continue;

                for ( var i = 0, len = subscribers.length; i < len; i++ ) {

                    if ( !( subscribers[i].token === token ) ) continue;

                    subscribers.splice( i, 1 );
                }
            }
        },

        /**
         * Publish that a particular viewport has become valid/invalid.
         *
         * @private
         */
        publish: function( name, matches ) {

            var subscribers = this.state.channels[ name ]
                , subsLength = subscribers ? subscribers.length : 0
                ;

            if ( !subscribers ) return;

            while ( subsLength-- ) {

                if ( name === '*' ) subscribers[ subsLength ].method( this.state.present, this.state.previous );
                else subscribers[ subsLength ].method( matches, this.vps[ name ] );
            }
        },

        /**
         * Update the state.
         *
         * @private
         */
        update: function() {

            if ( !this.state.subscribers ) return;

            this.state.previous = this.state.present;
            this.state.present = this.current();

            if ( this.state.present === this.state.previous ) return;

            if ( this.state.previous.name ) {
                this.publish( this.state.previous.name, false );
            }

            this.publish( this.state.present.name, true );

            if ( this.state.previous.name || this.state.present.name ) {
                this.publish( '*' );
            }
        }
    };

    return function( viewports, options ) {

        var instance;
        var config = {
            units: 'px',
            delay: 200
        };

        if ( typeof options === 'string' ) {
            config.units = options;
        }
        else if ( typeof options === 'object' ) {
            config.units = options.units || config.units;
            config.delay = isNaN( options.delay ) ? config.delay : options.delay;
        }

        instance = new Viewport( viewports, config );

        if ( !hasMatchMedia ) {
            instances.push( instance );
            updateQueries( 0 )();
        }

        instance.update();

        // Provide public API
        return {
            vps: instance.vps,
            viewports: instance.viewports,
            is: instance.is.bind( instance ),
            current: instance.current.bind( instance ),
            matches: instance.matches.bind( instance ),
            subscribe: instance.subscribe.bind( instance ),
            unsubscribe: instance.unsubscribe.bind( instance )
        };
    };
}));