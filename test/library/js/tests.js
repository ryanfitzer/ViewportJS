describe( 'API Setup', function() {

    it( 'should set up a viewport', function() {

        var vp = viewport([
            {
                name: 'first',
                width: [ 1 ]
            }
        ]);

        assert.deepEqual( vp.is( 'first' ), true );
        assert.deepEqual( vp.current(), vp.vps[ 'first' ] );
        assert.deepEqual( vp.matches( 'first' ), true );
    });
});

describe( 'API Tests', function() {

    // phantomjs defaults to width = 300, height = 400
    var width = viewportSize.getWidth();
    var height = viewportSize.getHeight();

    it( 'should return the correct viewport object based on width', function() {

        var vp = viewport([
            {
                name: 'first',
                width: [ 0, width - 1 ]
            },
            {
                name: 'second',
                width: [ width ]
            }
        ]);

        assert.equal( vp.current(), vp.vps[ 'second' ] );
        assert.equal( vp.matches( 'second' ), true );
        assert.equal( vp.is( 'second' ), true );
    });

    it( 'should return the correct viewport object based on height', function() {

        var vp = viewport([
            {
                name: 'first',
                height: [ 0, height - 1 ]
            },
            {
                name: 'second',
                height: [ height ]
            }
        ]);

        assert.equal( vp.current(), vp.vps[ 'second' ] );
        assert.equal( vp.matches( 'second' ), true );
        assert.equal( vp.is( 'second' ), true );
    });

    it( 'should return the correct viewport object based on width and height', function() {

        var vp = viewport([
            {
                name: 'first',
                height: [ 0, height - 1 ],
                width: [ 0, width - 1 ]
            },
            {
                name: 'second',
                height: [ height ],
                width: [ width ]
            }
        ]);

        assert.equal( vp.current(), vp.vps[ 'second' ] );
        assert.equal( vp.matches( 'second' ), true );
        assert.equal( vp.is( 'second' ), true );
    });

    it( 'should return the last matching viewport object when multiple match', function() {

      var vp = viewport([
        {
          name: 'first',
          height: [ height ],
          width: [ width ]
        },
        {
          name: 'second',
          height: [ height ],
          width: [ width ]
        },
        {
          name: 'third',
          height: [ height ],
          width: [ width ]
        }
      ]);

      assert.equal( vp.current(), vp.vps[ 'third' ] );
      assert.equal( vp.matches( 'third' ), true );
      assert.equal( vp.is( 'third' ), true );

    });
});

describe( 'Media Query Tests', function () {

    var width = viewportSize.getWidth();
    var height = viewportSize.getHeight();

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

    var cases = {

        '320x700': {
            'small':        'match',
            'medium':       'no match',
            'medium-alt':   'current',
            'large':        'no match'
        },

        '481x700': {
            'small':        'no match',
            'medium':       'match',
            'medium-alt':   'current',
            'large':        'no match'
        },

        '601x599': {
            'small':        'no match',
            'medium':       'current',
            'medium-alt':   'no match',
            'large':        'no match'
        },

        '924x700': {
            'small':        'no match',
            'medium':       'no match',
            'medium-alt':   'no match',
            'large':        'no match'
        },

        '925x700': {
            'small':        'no match',
            'medium':       'no match',
            'medium-alt':   'no match',
            'large':        'current'
        }
    }

    var config = cases[ width + 'x' + height ];

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

    Object.keys( cases ).forEach( function ( vp ) {

        if ( width + 'x' + height === vp ) {

            it( 'viewport should equal its case when window is ' + vp , function() {

                assert.isTrue( isViewportEqual( config ) );
            });
        }
        else {

            it( 'viewport should equal its case when window is ' + vp );
        }
    });
});
