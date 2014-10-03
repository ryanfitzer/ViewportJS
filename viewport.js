/*! ViewportJS 0.5.0 | https://github.com/ryanfitzer/ViewportJS | Copyright (c) 2012 Ryan Fitzer | License: (http://www.opensource.org/licenses/mit-license.php) */
;(function ( root, factory ) {

    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define( factory );

    } else {

        // Browser global
        root.viewport = factory();
    }

}( this, function() {

    var timer
        , hasVPChanged = false
        , html = document.documentElement
        ;

    // Cache viewport dimensions for all to use.
    var vpSize = {
        width: 0,
        height: 0
    };

    // Default viewport object.
    var vpEmpty = {
        name: '',
        width: [],
        height: []
    }

    // Save all created instances for later access.
    var instances = [];

    /**
     * Set up the `getWidth` function to use the correct width property.
     *
     * @credit https://github.com/tysonmatanich/viewportSize
     */
    var getWidth = ( function getWidth() {

        var shim
            , tempDiv
            , tempBody
            , docHead = document.head || document.getElementsByTagName( 'head' )[0]
            ;
        
        var getInnerWidth = function() {
            return window.innerWidth;
        };
        
        var getClientWidth = function() {
            return html.clientWidth;
        };
        
        // IE < 8 do not support window.innerWidth
        if ( window.innerWidth === undefined ) {
        
            shim = getClientWidth;
        
        }
        // WebKit browsers change the size of their CSS viewport when scroll bars
        // are visible, while most other browsers do not. Since window.innerWidth
        // remains constant regardless of the scroll bar state, it is not a good
        // option for use with Chrome or Safari. Additionally, Internet Explorer
        // 6, 7, and 8 do not support window.innerWidth. On the other hand,
        // document.documentElement.clientWidth changes based on the scroll bar
        // state and therefore is not a good option for Internet Explorer, Firefox, or Opera.
        // source: https://github.com/tysonmatanich/viewportSize#why-should-i-use-it
        else {

            // Create a new body element to do our measuring without affecting the real body.
            tempBody = document.createElement( 'body' );
            tempBody.style.cssText = 'overflow:scroll';
            tempDiv = document.createElement( 'div' );
            tempDiv.id = 'viewportjs-div-test-element';
            tempDiv.style.cssText = 'position:absolute;top:-1000px;';
            tempDiv.innerHTML = [
                '<style>',
                    '@media( width:' + html.clientWidth + 'px ) {',
                        '#viewportjs-div-test-element {',
                            'width:10px !important',
                        '}',
                    '}',
                '</style>'
            ].join( '' );

            tempBody.appendChild( tempDiv );
            html.insertBefore( tempBody, docHead );

            // If tempDiv.offsetWidth is 10 then the
            // CSS viewport is affected by scrollbar visibility.
            if ( tempDiv.offsetWidth === 10 ) shim = getClientWidth;
            else shim = getInnerWidth;

            html.removeChild( tempBody );
        }

        return shim;
    })();

    /**
     * Get the current viewport dimensions.
     */
    function getVPSize() {

        return {
            width: getWidth(),
            height: html.clientHeight
        }
    }

    /**
     * Set the current viewport dimensions on the `vpSize` object.
     */
    function updateVPSize() {

        var size = getVPSize();

        vpSize = {
            width: size.width,
            height: size.height
        }

        notifyInstances();
    }

    /**
     * Throttle checking the vp size
     */
    function throttleVPSize() {

        clearTimeout( timer );

        timer = setTimeout( function() {

            // The `throttleVPSize` function is only called when the `resize` or
            // `orientationchange` events fire. Until then, the browser window is
            // at its default state. This var enables subscribers whose viewport's
            // match when first subscribed to have their listeners to be called.
            if ( !hasVPChanged ) hasVPChanged = true;

            updateVPSize();

        }, 100 );
    }

    /**
     * Notify all instances and APIs that `vpSize` has changed.
     */
    function notifyInstances() {

        for ( var i = 0, len = instances.length; i < len; i++ ) {

            instances[ i ][1].size = vpSize;
            instances[ i ][0].update.call( instances[ i ][0] );
        }
    }

    /**
     * Poor man's `bind()`
     */
    function proxy( context, fn ) {

        return function() {
            return fn.apply( context, arguments );
        }
    }

    /**
     * Create the test functions that excute when querying a viewport.
     */
    function createTest( vp ) {
    
        return function() {
    
            var wmin = true
                , wmax = true
                , hmin = true
                , hmax = true
                , test = true
                , size = vpSize
                ;
            
            if ( vp.width ) {
            
                wmin = size.width >= vp.width[0];
                wmax = vp.width[1] ? size.width <= vp.width[1] : true;
            }
            
            if ( vp.height ) {
            
                hmin = size.height >= vp.height[0];
                hmax = vp.height[1] ? size.height <= vp.height[1] : true;
            }
            
            return wmin && wmax && hmin && hmax && test;
        };
    }

    /**
     * Viewport constructor.
     */
    function Viewport( viewports ) {

        this.vps = {};
        this.viewports = viewports;
        this.state = {};
        this.state.channels = {};
        this.state.tokenUid = -1;
        this.state.subscribers = {};
        this.state.previous = vpEmpty;
        this.state.present = vpEmpty;
        this.state.initialUpdate = true;

        // Setup the `vps` object.
        for ( var i = 0, len = this.viewports.length; i < len; i++ ) {
        
            var vp = this.viewports[i];
            
            this.vps[ vp.name ] = vp;
            this.vps[ vp.name ].test = createTest( vp );
        }
        
        return this;
    }

    /**
     * Viewport prototype.
     */
    Viewport.prototype = {
    
        /**
         * Check a specific viewport against the current viewport.
         */
        is: function( name ) {
        
            var current = this.current();
        
            return current.name === name;
        },
    
        /**
         * Get the current viewport.
         */
        current: function() {
        
            var current = vpEmpty;
            
            // Reverse the array to check from
            // least important to most important
            // this.viewports.reverse();
            
            for ( var i = 0, len = this.viewports.length; i < len; i++ ) {
            
                var v = this.viewports[i]
                    , name = v.name
                    ;
                
                if ( !this.vps[ name ] ) continue;
                
                if ( !this.vps[ name ].test() ) continue;
                
                current = v;
            }
            
            // Reset
            // this.viewports.reverse();
            
            return current;
        },
    
        /**
         * Check if a specific viewport matches.
         */
        matches: function( name ) {
        
            return this.vps[ name ] && this.vps[ name ].test();
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
            if ( name === '*' ) method( this.state.present, this.state.previous );

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

            // Only update the state if:
            //  - this is the initial update
            //  - the viewport has changed from its original state
            if ( this.state.initialUpdate || hasVPChanged ) {

                if ( this.state.initialUpdate ) this.state.initialUpdate = false;

                this.state.previous = this.state.present;
                this.state.present = this.current();
            }

            // Only publish when a viewport becomes valid/invalid
            if ( this.state.present === this.state.previous ) return;

            this.publish( this.state.previous.name, false );
            this.publish( this.state.present.name, true );
            this.publish( '*' );
        }
    };

    if ( 'addEventListener' in window ) {

        window.addEventListener( 'resize', throttleVPSize );
        window.addEventListener( 'orientationchange', throttleVPSize );

    } else {

        window.attachEvent( 'onresize', throttleVPSize )
    }

    // Populate the `vpSize` object.
    updateVPSize();

    // Export it!
    return function( viewports ) {

        var api
            , inst = new Viewport( viewports )
            ;
        
        // Set the initial viewport state.
        inst.update();
        
        // Provide public API
        api = {
            size: vpSize,
            vps: inst.vps,
            viewports: inst.viewports,
            is: proxy( inst, inst.is ),
            current: proxy( inst, inst.current ),
            matches: proxy( inst, inst.matches ),
            subscribe: proxy( inst, inst.subscribe ),
            unsubscribe: proxy( inst, inst.unsubscribe ),
        };
        
        // Save the instance and api object for later.
        instances.push( [ inst, api ] );
        
        return api;
    };
}));