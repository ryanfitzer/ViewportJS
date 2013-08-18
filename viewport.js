/*! ViewportJS 0.0.2 | Copyright (c) 2012 Ryan Fitzer | License: (http://www.opensource.org/licenses/mit-license.php) */
!function() {
    
    var toDebug = false
        , html = document.documentElement
        ;
    
    function debug( vp ) {
        
        console.log( 'Viewport: ', vp.name );
        console.log( '  wmin:', vp.width && vp.width[0] );
        console.log( '  wmax:', vp.width && vp.width[1] );
        console.log( '  hmin:', vp.height && vp.height[0] );
        console.log( '  hmax:', vp.height && vp.height[1] );
        console.log( '  cond:', vp.condition );
    }
    /**
     * Add viewport conditions to Modernizr.
     */
    function modernize( vp ) {
        
        var mdnzr = window.Modernizr;
        
        if ( !mdnzr || !mdnzr.addTest ) return;
        
        mdnzr.addTest( vp.name , vp.test );
    }
    
    function createTest( vp ) {
        
        return function() {
            
            var wmin = true
                , wmax = true
                , hmin = true
                , hmax = true
                , test = true
                ;

            if ( vp.width ) {
            
                wmin = html.clientWidth >= vp.width[0];
                wmax = vp.width[1] ? html.clientWidth <= vp.width[1] : true;
            }
        
            if ( vp.height ) {
                hmin = html.clientHeight >= vp.height[0];
                hmax = vp.height[1] ? html.clientHeight <= vp.height[1] : true;
            }
            
            if ( vp.condition ) test = vp.condition();
            
            if ( toDebug ) console.log( '  ' + vp.name + ':', wmin, wmax, hmin, hmax, test );
            
            return wmin && wmax && hmin && hmax && test;
        }
    }
    
    /**
     * Viewports constructor.
     */
    function Viewport( viewports ) {
        
        this.vps = {};
        this.viewports = viewports;
        this.length = viewports.length;

        for ( var i = 0; i < this.length; i++ ) {
            
            var vp = this.viewports[i];
            
            this.vps[ vp.name ] = vp;
            
            this.vps[ vp.name ].test = createTest( vp );
            
            if ( toDebug ) debug( this.vps[ vp.name ] );
            
            modernize( this.vps[ vp.name ] );
        }
        
        return this;
    }
    
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
    
    window.viewport = function( viewports ) {
        
        return new Viewport( viewports );
    }
    
}();