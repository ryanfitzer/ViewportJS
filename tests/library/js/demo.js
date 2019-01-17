!function () {

    var vps = viewport( [
        {
            name: 'small',
            query: '( max-width: 480px )'
        },
        {
            name: 'medium',
            query: '( max-width: 600px ) and ( min-height: 600px )'
        },
        {
            name: 'large',
            query: '( min-width: 481px ) and ( max-width: 768px )'
        },
        {
            name: 'xlarge',
            query: '( min-width: 925px )'
        }
    ] );

    window.testvps = vps;

    var statusCurrent = document.querySelector( '#vp-current code' );
    var statusPrev = document.querySelector( '#vp-previous code' );

    function updateView( id, state ) {

        var element = document.getElementById( id );

        statusCurrent.innerText = vps.current().name;
        statusPrev.innerText = vps.previous().name;

        if ( state.current ) {

            element.setAttribute( 'data-state', 'current' );

        }
        else if ( state.matches ) {

            element.setAttribute( 'data-state', 'matches' );

        }
        else {

            element.setAttribute( 'data-state', '' );

        }

    }

    vps.subscribe( 'small', function ( state ) {
        updateView( 'vpjs-small', state );
    } );

    vps.subscribe( 'medium', function ( state ) {
        updateView( 'vpjs-medium', state );
    } );

    vps.subscribe( 'large', function ( state ) {
        updateView( 'vpjs-large', state );
    } );

    vps.subscribe( 'xlarge', function ( state ) {
        updateView( 'vpjs-xlarge', state );
    } );

    // vps.small( function ( state ) {
    //     updateView( 'vpjs-small', state );
    // } );
    //
    // vps.medium( function ( state ) {
    //     updateView( 'vpjs-medium', state );
    // } );
    //
    // vps.large( function ( state ) {
    //     updateView( 'vpjs-large', state );
    // } );
    //
    // vps.xlarge( function ( state ) {
    //     updateView( 'vpjs-xlarge', state );
    // } );

    // vps.subscribe( '*', function( current, previous ) {
    //
    //     vps.viewports.forEach( function ( viewport ) {
    //
    //         viewport = vps.vps[ viewport.name ];
    //
    //         if ( viewport.name !== current.name ) {
    //             updateView( 'vpjs-' + viewport.name, false, viewport, previous );
    //         }
    //     });
    // });

}();