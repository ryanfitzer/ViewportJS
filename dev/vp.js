/*! ViewportJS 0.1.0 | https://github.com/ryanfitzer/ViewportJS | Copyright (c) 2012 Ryan Fitzer | License: (http://www.opensource.org/licenses/mit-license.php) */

;(function ( root, factory ) {
    
    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define( factory );
        
    } else {
        
        // Browser global
        root.viewport = factory();
    }
    
}( this, function() {

	var getWidth
		, html = document.documentElement
		, docHead = document.head || document.getElementsByTagName( 'head' )[0]
		;
    
    var defaults = {
        debug: false,
        modernize: false
    }
    
	/**
	 * Log info on a viewport object.
	 */
	function debug( vp ) {

		console.log( '\nViewport:', vp.name );
		console.log( '    wmin:', vp.width && vp.width[0] );
		console.log( '    wmax:', vp.width && vp.width[1] );
		console.log( '    hmin:', vp.height && vp.height[0] );
		console.log( '    hmax:', vp.height && vp.height[1] );
		console.log( '    cond:', vp.condition );
	}

	/**
	 * Set up the `getWidth` function to use the correct width property.
	 *
	 * @props https://github.com/tysonmatanich/viewportSize
	 */
	function shimInnerWidth() {

		var tempDiv
			, tempBody
			;

		var innerWidth = function() {
			return window.innerWidth;
		};

		var clientWidth = function() {
			return html.clientWidth;
		};

		// Media queries not supported.
		if ( innerWidth === undefined ){
			getWidth = clientWidth;
		}

		// Test via a media query.
		tempBody = document.createElement( 'body' );
		tempBody.style.cssText = 'overflow:scroll';

		tempDiv = document.createElement( 'div' );
		tempDiv.id = 'viewportjs-div-test-element;';
		tempDiv.style.cssText = 'position:absolute;top:-1000px;';
		tempDiv.innerHTML = [
			'<style>',
			    '@media( width:' + html.clientWidth + 'px ) {',
			        'body > #viewportjs-div-test-element {',
			            'width:10px !important',
			        '}',
			    '}',
			'</style>'
		].join( '' );

		tempBody.appendChild( tempDiv );
		html.insertBefore( tempBody, docHead );

		if ( tempDiv.offsetWidth === 10 ){
			getWidth = clientWidth;
		}
		else {
			getWidth = innerWidth;
		}

		html.removeChild( tempBody );
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
	function createTest( vp, debug ) {

		return function() {

			var innerWidth
				, wmin = true
				, wmax = true
				, hmin = true
				, hmax = true
				, test = true
				;

			if ( vp.width ) {

				innerWidth = getWidth();

				wmin = innerWidth >= vp.width[0];
				wmax = vp.width[1] ? innerWidth <= vp.width[1] : true;
			}

			if ( vp.height ) {
				hmin = html.clientHeight >= vp.height[0];
				hmax = vp.height[1] ? html.clientHeight <= vp.height[1] : true;
			}

			if ( vp.condition ) {
				test = vp.condition();
			}

			if ( debug ) {

        		console.log( '\nViewport:', vp.name );
        		console.log( '    wmin:', wmin );
        		console.log( '    wmax:', wmax );
        		console.log( '    hmin:', hmin );
        		console.log( '    hmax:', hmax );
        		console.log( '    cond:', test );
                
			}

			return wmin && wmax && hmin && hmax && test;
		};
	}

	/**
	 * ViewportJS constructor.
	 */
	function Viewport( viewports, options ) {
        
        var value;
        
		this.vps = {};
		this.viewports = viewports;
		this.options = options || {};
		this.length = viewports.length;
        
        for ( var key in defaults ) {
            
            if ( !this.options.hasOwnProperty( key ) ) {
                
                this.options[ key ] = defaults[ key ];
            }
        }
        
        if ( this.options.debug ) console.log( '\nOptions:', this.options );
        
		for ( var i = 0; i < this.length; i++ ) {

			var vp = this.viewports[i];

			this.vps[ vp.name ] = vp;
			this.vps[ vp.name ].test = createTest( vp, this.options.debug );

			if ( this.options.debug ) {
                debug( this.vps[ vp.name ] );
			}

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


	// Shim it.
	shimInnerWidth();

	// Release it!
	return function( viewports, options ) {

		return new Viewport( viewports, options );
	};

}));