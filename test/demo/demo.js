function setState( id, isCurrent, vp ) {
    
    var element = document.getElementById( id );
    
    if ( isCurrent ) {
      
        element.setAttribute( 'data-state', 'current' );
    }
    else if ( vp.mql.matches ) {
      
        element.setAttribute( 'data-state', 'matches' );
    }
    else {
      
        element.setAttribute( 'data-state', '' );
    }
}

var vp = viewport([
    {
        name: 'small',
        width: [ 0, 480 ]
    },
    {
        name: 'medium',
        width: [ 481, 768 ]
    },
    {
        name: 'medium-alt',
        width: [ 0, 600 ],
        height: [ 600 ]
    },
    {
        name: 'large',
        width: [ 925 ]
    }
]);

vp.subscribe( 'small', function( isCurrent, vp ) {
    setState( 'vps-small', isCurrent, vp );
});

vp.subscribe( 'medium', function( isCurrent, vp ) {
    setState( 'vps-medium', isCurrent, vp );

});

vp.subscribe( 'medium-alt', function( isCurrent, vp ) {
    setState( 'vps-medium-alt', isCurrent, vp );
});

vp.subscribe( 'large', function( isCurrent, vp ) {
    setState( 'vps-large', isCurrent, vp );
});

vp.subscribe( '*', function( current, previous ) {

    vp.viewports.forEach( function ( viewport ) {

        viewport = vp.vps[ viewport.name ];

        if ( viewport.name !== current.name ) {
            viewport.mql.matches && console.log( viewport.name );
            setState( 'vps-' + viewport.name, false, viewport );
        }
    });
});
