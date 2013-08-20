/*! ViewportJS 0.0.3 | Copyright (c) 2012 Ryan Fitzer | License: (http://www.opensource.org/licenses/mit-license.php) */
!function() {
    
    var getWidth
        , html = document.documentElement
        ;
    
    /**
     * Log info on a viewport object.
     */
    function debug( vp ) {
        
        console.log( 'Viewport: ', vp.name );
        console.log( '  wmin:', vp.width && vp.width[0] );
        console.log( '  wmax:', vp.width && vp.width[1] );
        console.log( '  hmin:', vp.height && vp.height[0] );
        console.log( '  hmax:', vp.height && vp.height[1] );
        console.log( '  cond:', vp.condition );
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
        }
        
        var clientWidth = function() {
            return html.clientWidth;
        }
        
        // Media queries not supported.
        if ( innerWidth === undefined ) getWidth = clientWidth;
        
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
        html.insertBefore( tempBody, document.head );
        
        if ( tempDiv.offsetWidth == 10 ) getWidth = clientWidth;
        else getWidth = innerWidth;
		
		html.removeChild( tempBody );
    }
    
    /**
     * Add viewport conditions to Modernizr.
     */
    function modernize( vp ) {
        
        var mdnzr = window.Modernizr;
        
        if ( !mdnzr || !mdnzr.addTest ) return;
        
        mdnzr.addTest( vp.name , vp.test );
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
            
            if ( vp.condition ) test = vp.condition();
            
            if ( debug ) console.log( '  ' + vp.name + ':', wmin, wmax, hmin, hmax, test );
            
            return wmin && wmax && hmin && hmax && test;
        }
    }
    
    /**
     * ViewportJS constructor.
     */
    function Viewport( viewports, options ) {
        
        this.vps = {};
        this.viewports = viewports;
        this.options = options || {};
        this.length = viewports.length;

        for ( var i = 0; i < this.length; i++ ) {
            
            var vp = this.viewports[i];
            
            this.vps[ vp.name ] = vp;
            
            this.vps[ vp.name ].test = createTest( vp, this.options.debug );
            
            if ( this.options.debug ) debug( this.vps[ vp.name ] );
            
            if ( this.options.modernize ) modernize( this.vps[ vp.name ] );
        }
        
        return this;
    }
    
    /**
     * ViewportJS prototype.
     */
    Viewport.prototype = {
        
        /**
         * Check a specific viewport.
         */
        is: function( name ) {
            
            return this.current().name === name;
        },
        
        /**
         * Returns a specific viewport object.
         */
        get: function( name ) {

            return this.vps[ name ];
        },
        
        /**
         * Get the current viewport
         */
        current: function() {

            var current;
            
            for ( var i = 0; i < this.viewports.length; i++ ) {
                
                var v = this.viewports[i]
                    , name = v.name
                    ;

                if ( !this.vps[ name ].test() ) continue;
            
                current = v;
            }

            return current;
        },
        
        /**
         * Match a specific viewport.
         */
        matches: function( name ) {
            
            return this.vps[ name ].test();
        }
    };
    
    
    // Shim it.
    shimInnerWidth();
    
    // Release it!
    window.viewport = function( viewports, options ) {
        
        return new Viewport( viewports, options );
    }
    
}();