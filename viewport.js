/*! ViewportJS 0.0.1 | Copyright (c) 2012 Ryan Fitzer | License: (http://www.opensource.org/licenses/mit-license.php) */
!function() {
    
    /**
     * Add viewport conditions to Modernizr.
     */
    function modernize( vps ) {
        
        var mdnzr = window.Modernizr;
        
        if ( !mdnzr || !mdnzr.addTest ) return;
        
        for ( var i = 0; i < vps.length; i++ ) {
            
            var v = vps[i];
            
            mdnzr.addTest( v.name , v.condition );
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
        }
        
        modernize( this.vps );
        
        return this;
    }
    
    Viewport.prototype = {
        
        /**
         * Returns a specific viewport object.
         */
        get: function( vp ) {

            return this.vps[ vp ];
        },
        
        /**
         * Check a specific viewport.
         */
        is: function( vp ) {
            
            return this.current().name === vp;
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

                if ( !this.vps[ name ].condition() ) continue;
            
                current = v;
            }

            return current;
        }
    };
    
    window.viewport = function( viewports ) {
        
        return new Viewport( viewports );
    }
    
}();