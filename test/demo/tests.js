!function () {

    /*
        - no match:
          - CSS: rgb(255, 0, 0)
          - VPJS: rgb(255, 0, 0)

        - current:
          - CSS: rgb(4, 193, 4)
          - VPJS: rgb(4, 193, 4)

        - match:
          - CSS: rgb(4, 193, 4)
          - VPJS: rgb(181, 193, 4)
    */
    var colors = {
        red: 'rgb(255, 0, 0)',
        green: 'rgb(4, 193, 4)',
        olive: 'rgb(181, 193, 4)'
    };

    var conditions = {
        'no match': {
            css: colors.red,
            vpjs: colors.red
        },
        'current': {
            css: colors.green,
            vpjs: colors.green
        },
        'match': {
            css: colors.green,
            vpjs: colors.olive
        }
    };

    var vps = [
        'small',
        'medium',
        'medium-alt',
        'large'
    ].reduce( function ( acc, name ) {

        acc[ name ] = {
            css: document.getElementById( 'css-' + name ),
            vpjs: document.getElementById( 'vpjs-' + name )
        };

        return acc;

    }, {} );

    function getBackgroundColor( element ) {
        return window.getComputedStyle( element ).backgroundColor;
    }

    function isViewportEqual( expected ) {

        var isEqual = true;

        Object.keys( vps ).forEach( function ( name ) {

            var didPass = getBackgroundColor( vps[ name ].css ) === conditions[ expected[ name ] ].css
                    && getBackgroundColor( vps[ name ].vpjs ) === conditions[ expected[ name ] ].vpjs

            if ( !didPass ) {
                isEqual = false;
                console.log( 'fail:', name );
            }
        });

        return isEqual;
    }

/*

    1. @media screen and (max-width: 480px)
      - Set browser to 320px x 700px

    isViewportEqual({
        'small':        'match',
        'medium':       'no match',
        'medium-alt':   'current',
        'large':        'no match'
    });
*/

/*
    2. @media screen and (min-width: 481px) and (max-width: 768px)
      - Set browser to 481px x 700px

    isViewportEqual({
        'small':        'no match',
        'medium':       'match',
        'medium-alt':   'current',
        'large':        'no match'
    });
*/

/*
    3. @media screen and (max-width: 600px) and (min-height: 600px)
      - Set browser to 601px x 599px

    isViewportEqual({
        'small':        'current',
        'medium':       'match',
        'medium-alt':   'no match',
        'large':        'no match'
    });
*/

/*
    4. @media screen and (min-width: 925px)
      - Set browser to 924px x 700px

    isViewportEqual({
        'small':        'no match',
        'medium':       'no match',
        'medium-alt':   'no match',
        'large':        'no match'
    });
*/

/*
    5. @media screen and (min-width: 925px)
      - Set browser to 925px x 700px

    isViewportEqual({
        'small':        'no match',
        'medium':       'no match',
        'medium-alt':   'no match',
        'large':        'current'
    });

*/
}();