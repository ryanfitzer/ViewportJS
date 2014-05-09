/*! {palceholder} */

;(function ( root, factory ) {
    
    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define(
            [
                'pubsub',
                'viewport'
            ],
            factory
        );
        
    } else {
        
        // Browser global
        root.psvp = factory(
            pubsub,
            viewport
        );
    }
    
}( this, function(
    
    pubsub,
    viewport
    
) {
    
    var state = {
        current: null,
        is: {},
        matches: {}
    }
    
    function setup( options ) {
        
        var vpObj = viewport( options )
            , psObj = pubsub()
            ;
        
        // Set event listeners to publish viewport channels
        
        setState( vpObj );
        
        createSubAPI( psObj );

        createChannels( vpObj );
        
        return state;
    }
    
    function setState( vpObj ) {
        
        var vpsName
            , viewports = vpObj.viewports
            , current = vpObj.current()
            ;
        
        var tempState = {
            current: current.name,
            is: {},
            matches: {}
        }
        
        for ( var i = 0; i < viewports.length; i++ ) {
            
            vpsName = viewports[i].name
            tempState.is[ vpsName ] = vpsName === current.name;
            tempState.matches[ vpsName ] = vpObj.matches( vpsName );
        }
        
        state = tempState;
        
        return state;
    }
    
    function createChannels( vpObj ) {
        
        var channels = []
            , viewports = vpObj.viewports
            ;
        
        for ( var i = 0; i < viewports.length; i++ ) {

            channels.push( viewports[i].name );
        }
        
        return channels;
    }
    
    function createSubAPI( psObj ) {

        return {
        
            on: psObj.subscribe,
            
            off: psObj.unsubscribe
        }
    }
    
    return function( options ) {
        
        return setup( options );
    }

}));