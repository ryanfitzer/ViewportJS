/*! ViewportJS github.com/ryanfitzer/ViewportJS/blob/master/LICENSE */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.viewport = factory();
    }
}( this, function() {

    // Stub API for handling server-side rendering scenarios.
    if ( typeof window === 'undefined' ) {

        return function() {

            var noop = function () { return {}; };

            return {
                vps: {},
                viewports: {},
                is: noop,
                current: noop,
                matches: noop,
                subscribe: noop,
                unsubscribe: noop
            };
        };
    };

    // Default viewport object to use when no queries match.
    var vpEmpty = {
        name: undefined,
        width: [],
        height: []
    };

    /**
     * Return an array containing the differences between 2 arrays.
     */
    function arrayDiff( a, b ) {

        a.sort();
        b.sort();

        return a.filter( function( val ) {

            return b.indexOf( val ) < 0;

        }).concat( b.filter( function( val ) {

            return a.indexOf( val ) < 0;
        }));
    }

    /**
     * Generic throttle method.
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
     */
    function createMediaQueryList( dimensions, units, listener ) {

        var mql = window.matchMedia( createExpression( dimensions, units ) );

        mql.addListener( listener );

        return mql;
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
            previous: vpEmpty,
            curMatches: [],
            prevMatches: []
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
            vpObj.listener = function( e ) {

                timer = throttle( self.update.bind( self, vpObj.name ), timer, self.options.delay );
            };
            vpObj.mql = createMediaQueryList( dimensions, self.options.units, vpObj.listener );
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

            this.state.prevMatches = this.state.curMatches;
            this.state.curMatches = [];

            var match = this.viewports.filter( function ( vp ) {

                var isMatch = this.vps[ vp.name ].mql.matches;

                if ( isMatch ) this.state.curMatches.push( this.vps[ vp.name ] );

                return isMatch;

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

            if ( name ) {
                return this.vps[ name ] && this.vps[ name ].mql.matches;
            }

            return this.state.curMatches;
        },

        /**
         * Subscribe to a particular viewport.
         */
        subscribe: function( name, method ) {

            var token;
            var subscribers;

            if ( !( name in this.vps ) && name !== '*' ) {
                throw new Error( 'The viewport "' + name + '" does not match any configured viewports.' );
            }

            token = this.state.tokenUid = this.state.tokenUid + 1;

            if ( !this.state.channels[ name ] ) {
                this.state.channels[ name ] = [];
            }

            subscribers = this.state.channels[ name ];

            subscribers.push({
                token: token,
                method: method
            });

            // Execute matches immediately to enable lazy subscribers.
            if ( name === this.state.present.name ) method( true, this.state.present );

            // The "*" channel is always fired.
            if ( name === '*' && ( this.state.previous.name || this.state.present.name ) ) {
                method( this.state.present, this.state.previous );
            }

            return this.unsubscribe( subscribers, token );
        },

        /**
         * Unsubscribe a listener from a particular viewport.
         */
        unsubscribe: function ( subscribers, token ) {

            return function () {

                return subscribers.reduce( function ( accum, sub, index ) {

                    if ( sub.token === token ) {

                        return subscribers.splice( index, 1 )[0];
                    };
                }, undefined );
            }
        },

        /**
         * Publish that a particular viewport has become valid/invalid.
         */
        publish: function( name, matches ) {

            var subscribers = this.state.channels[ name ]
                , subsLength = subscribers ? subscribers.length : 0
                ;

            if ( !subscribers ) return;

            while ( subsLength-- ) {

                if ( name === '*' ) {
                    subscribers[ subsLength ].method( this.state.present, this.state.previous );
                }
                else {
                    subscribers[ subsLength ].method( matches, this.vps[ name ] );
                }
            }
        },

        /**
         * Update the state.
         */
        update: function( name ) {

            this.state.previous = this.state.present;
            this.state.present = this.current();

            if ( this.state.previous.name !== this.state.present.name ) {
                this.publish( this.state.previous.name, false );
                this.publish( this.state.present.name, true );
            }

            if ( arrayDiff( this.state.curMatches, this.state.prevMatches ).length ) {
                this.publish( '*' );
            }
        }
    };

    return function( viewports, options ) {

        var instance;
        var config = {
            units: 'px',
            delay: 0
        };

        if ( typeof options === 'string' ) {
            config.units = options;
        }
        else if ( typeof options === 'object' ) {
            config.units = options.units || config.units;
            config.delay = isNaN( options.delay ) ? config.delay : options.delay;
        }

        instance = new Viewport( viewports, config );

        instance.update();

        return {
            vps: instance.vps,
            viewports: instance.viewports,
            is: instance.is.bind( instance ),
            current: instance.current.bind( instance ),
            matches: instance.matches.bind( instance ),
            subscribe: instance.subscribe.bind( instance )
        };
    };
}));