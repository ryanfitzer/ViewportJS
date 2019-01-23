!function () {

    var demo = {};
    var file = './tests.html';
    var isPopup = window.opener;
    var html = document.documentElement;
    var statusCurrent = document.querySelector( '#vp-current code' );
    var statusPrev = document.querySelector( '#vp-previous code' );

    function initView() {

        if ( isPopup ) {

            html.classList.add( 'popup' );
        }
    }

    function updateView( vp ) {

        var element = document.getElementById( 'vpjs-' + vp.name );

        if ( vp.current ) element.setAttribute( 'data-state', 'current' );
        else if ( vp.matches ) element.setAttribute( 'data-state', 'matches' );
        else element.setAttribute( 'data-state', '' );

        if ( isPopup ) return;

        statusCurrent.innerText = vpjs.current().name;
        statusPrev.innerText = vpjs.previous().name;

    }

    function popup( e ) {

        window.open( file, '_blank', 'width=1000,height=1000,scrollbars=yes' );

    }

    vpjs = viewport( [
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

    vpjs( 'small', updateView );

    vpjs( 'medium', updateView );

    vpjs( 'large', updateView );

    vpjs( 'xlarge', updateView );

    demo.vpjs = vpjs;
    demo.popup = popup;
    window.demo = demo;

    initView();

}();