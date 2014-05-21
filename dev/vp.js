/*! ViewportJS 0.2.0 | https://github.com/ryanfitzer/ViewportJS | Copyright (c) 2012 Ryan Fitzer | License: (http://www.opensource.org/licenses/mit-license.php) */

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
        , html = document.documentElement
		;
    
    var vpSize = {
        width: 0,
        height: 0
    };
    
    var defaults = {
        debug: false,
        modernize: false
    };

	/**
	 * Set up the `getWidth` function to use the correct width property.
	 *
	 * @credit https://github.com/tysonmatanich/viewportSize
	 */
	var getWidth = (function getWidth() {

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

		// IE6 & IE7 do not support window.innerWidth
		if ( window.innerWidth === undefined ) {
		
        	getWidth = getClientWidth;
            
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
        }
        
        html.removeChild( tempBody );
        
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
    }
    
    /**
     * Throttle checking the vp size
     */
    function throttleVPSize() {

        clearTimeout( timer );
        
        timer = setTimeout( updateVPSize, 100 );
        
    }
    
	/**
	 * Log info on a viewport object.
	 */
	function debug( vp ) {
        
        // Use string concat for older IE
		console.log( '\n' + vp.name + '\n--------------' );
		console.log( '  wmin: ' + ( vp.width && vp.width[0] >= 0 ? vp.width[0] : '' ) );
		console.log( '  wmax: ' + ( vp.width && vp.width[1] >= 0 ? vp.width[1] : '' ) );
		console.log( '  hmin: ' + ( vp.height && vp.height[0] >= 0 ? vp.height[0] : '' ) );
		console.log( '  hmax: ' + ( vp.height && vp.height[1] >= 0 ? vp.height[1] : '' ) );
		console.log( '  cond: ' + ( vp.condition ? vp.condition : '' ) );
	}
    
	/**
	 * Add viewport conditions to Modernizr.
	 */
	function modernize( vp ) {

		var mdnzr = window.Modernizr;

		if ( !mdnzr || !mdnzr.addTest ){
			return;
		}

		mdnzr.addTest( vp.name, vp.test );
	}

	/**
	 * Create the test functions that excute when querying a viewport.
	 */
	function createTest( vp, isDebug ) {

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

			if ( vp.condition ) {
                
				test = vp.condition();
			}

			if ( isDebug ) debug( vp );

			return wmin && wmax && hmin && hmax && test;
		};
	}

	/**
	 * ViewportJS constructor.
	 */
	function Viewport( viewports, options ) {
        
        this.vps = {};
		this.viewports = viewports;
		this.options = options || {};
		this.length = viewports.length;

        for ( var key in defaults ) {
            
            if ( !this.options.hasOwnProperty( key ) ) {
                
                this.options[ key ] = defaults[ key ];
            }
        }
        
        if ( this.options.debug ) {
            console.log( '\nOptions:', this.options );
        }

		for ( var i = 0; i < this.length; i++ ) {

			var vp = this.viewports[i];

			this.vps[ vp.name ] = vp;
			this.vps[ vp.name ].test = createTest( vp, this.options.debug );

			if ( this.options.modernize ) {
				modernize( this.vps[ vp.name ] );
			}
		}

		return this;
	}

	/**
	 * ViewportJS prototype.
	 */
	Viewport.prototype = {

		/**
		 * Check a specific viewport against the current viewport.
		 */
		is: function( name ) {
            
            var current = this.current();
            
            if ( !name ) return current;
            
			return current.name === name;
		},

		/**
		 * Get the current viewport
		 */
		current: function() {

			var current;
            
            // Reverse the array to check from
            // least important to most important
            this.viewports.reverse();

			for ( var i = 0; i < this.viewports.length; i++ ) {

				var v = this.viewports[i]
					, name = v.name
					;

				if ( !this.vps[ name ].test() ) {
					continue;
				}

				current = v;
			}
            
            // Reset
            this.viewports.reverse();
            
			return current;
		},

		/**
		 * Match a specific viewport.
		 */
		matches: function( name ) {

			return this.vps[ name ].test();
		},
        
		/**
		 * Returns a specific viewport object.
		 */
		get: function( name ) {

			return this.vps[ name ];
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
	return function( viewports, options ) {

		return new Viewport( viewports, options );
	};
}));