!function () {

    var statusCurrent = document.querySelector( '#vp-current code' );
    var statusPrev = document.querySelector( '#vp-previous code' );

    function setState( id, isCurrent, vp, prev ) {

        var element = document.getElementById( id );

        statusCurrent.innerText = vps.current().name;
        statusPrev.innerText = prev ? prev.name : 'undefined';

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

    var vps = viewport( [
        {
            name: 'small',
            query: '( max-width: 480px )'
        },
        {
            name: 'medium',
            query: '( min-width: 481px ) and ( max-width: 768px )'
        },
        {
            name: 'medium-alt',
            query: '( max-width: 600px ) and ( min-height: 600px )'
        },
        {
            name: 'large',
            query: '( min-width: 925px )'
        }
    ] );

    window.testvps = vps;

    vps.subscribe( 'small', function ( isCurrent, vp ) {
        // setState( 'vpjs-small', isCurrent, vp, vps.previous() );
    } );

    vps.subscribe( 'medium', function ( isCurrent, vp ) {
        // setState( 'vpjs-medium', isCurrent, vp, vps.previous() );

    } );

    vps.subscribe( 'medium-alt', function ( isCurrent, vp ) {
        // setState( 'vpjs-medium-alt', isCurrent, vp, vps.previous() );
    } );

    vps.subscribe( 'large', function ( isCurrent, vp ) {
        // setState( 'vpjs-large', isCurrent, vp, vps.previous() );
    } );

    // vps.subscribe( '*', function( current, previous ) {
    //
    //     vps.viewports.forEach( function ( viewport ) {
    //
    //         viewport = vps.vps[ viewport.name ];
    //
    //         if ( viewport.name !== current.name ) {
    //             setState( 'vpjs-' + viewport.name, false, viewport, previous );
    //         }
    //     });
    // });

}();