!function () {

    // phantomjs defaults to width = 300, height = 400

    describe( 'API', function() {

        var width;
        var height;

        beforeEach( function () {

            width = viewportSize.getWidth();
            height = viewportSize.getHeight();
        });

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

            assert.equal( vp.current().name, 'second' );
            assert.isTrue( vp.matches( 'second' ) );
            assert.isTrue( vp.is( 'second' ) );
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

            assert.equal( vp.current().name, 'second' );
            assert.isTrue( vp.matches( 'second' ) );
            assert.isTrue( vp.is( 'second' ) );
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

            assert.equal( vp.current().name, 'second' );
            assert.isTrue( vp.matches( 'second' ) );
            assert.isTrue( vp.is( 'second' ) );
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

          assert.equal( vp.current().name, 'third' );
          assert.isTrue( vp.matches( 'third' ) );
          assert.isTrue( vp.is( 'third' ) );

        });

        it( 'should subscribe and unsubscribe to a viewport', function() {

            var vp = viewport([
                {
                    name: 'first',
                    width: [ 0, width ]
                }
            ]);

            var unsub0 = vp.subscribe( 'first', function () {});
            var unsub1 = vp.subscribe( 'first', function () {});

            assert.ok( unsub0().token === 0 );
            assert.ok( typeof unsub0() === 'undefined' );
            assert.ok( unsub1().token === 1 );
            assert.ok( typeof unsub1() === 'undefined' );
        });
    });

    function startMocha() {

        document.getElementById( 'mocha' ).removeChild( document.getElementById( 'mocha-pending' ) );

        mocha.run();
    }

    if ( !window.opener ) {

        return startMocha();
    }

    var sizeDelta = {
        width: window.outerWidth - window.innerWidth,
        height: window.outerHeight - window.innerHeight
    }

    var viewportTests = {

        '480x700': {
            'small': 'match',
            'medium': 'not match',
            'medium-alt': 'be current',
            'large': 'not match'
        },
        '600x700': {
            'small': 'not match',
            'medium': 'match',
            'medium-alt': 'be current',
            'large': 'not match'
        },
        '601x700': {
            'small': 'not match',
            'medium': 'be current',
            'medium-alt': 'not match',
            'large': 'not match'
        },
        '768x700': {
            'small': 'not match',
            'medium': 'be current',
            'medium-alt': 'not match',
            'large': 'not match'
        },
        '769x700': {
            'small': 'not match',
            'medium': 'not match',
            'medium-alt': 'not match',
            'large': 'not match'
        },
        '924x700': {
            'small': 'not match',
            'medium': 'not match',
            'medium-alt': 'not match',
            'large': 'not match'
        },
        '925x700': {
            'small': 'not match',
            'medium': 'not match',
            'medium-alt': 'not match',
            'large': 'be current'
        }
    }

    var viewportTestsSizes = Object.keys( viewportTests );

    var colors = {
        red: 'rgb(255, 0, 0)',
        green: 'rgb(4, 193, 4)',
        olive: 'rgb(181, 193, 4)'
    };

    var conditions = {
        'not match': {
            css: colors.red,
            vpjs: colors.red
        },
        'be current': {
            css: colors.green,
            vpjs: colors.green
        },
        'match': {
            css: colors.green,
            vpjs: colors.olive
        }
    };

    var vpsElements = [
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

    function resizeWindow( size ) {

        var sizes = size.match( /([\d]+)x([\d]+)/ );
        var width = parseInt( sizes[ 1 ], 10 );
        var height = parseInt( sizes[ 2 ], 10 );

        console.log( 'Resizing to ' + width + 'x' + height );

        window.resizeTo( width + sizeDelta.width, height + sizeDelta.height );
    }

    var listener = function ( e ) {

        setTimeout( function () {

            var nextSize = viewportTestsSizes.shift();
            var currentSize = viewportSize.getWidth() + 'x' + viewportSize.getHeight();
            var currentTest = viewportTests[ currentSize ];

            describe( 'Resize to ' + currentSize, function () {

                Object.keys( currentTest ).forEach( function ( name ) {

                    var elements = vpsElements[ name ];
                    var expectedCondition = conditions[ currentTest[ name ] ];
                    var actualCondition = {
                        css: getBackgroundColor( elements[ 'css' ] ),
                        vpjs: getBackgroundColor( elements[ 'vpjs' ] )
                    };

                    var closure = function ( expected, actual ) {

                        return function () {

                            assert.deepEqual( actual, expected );
                        }
                    }

                    it( name + ' should ' + currentTest[ name ] , closure( expectedCondition, actualCondition ) );

                });
            });

            if ( !nextSize ) {

                window.removeEventListener( 'resize', listener );

                return startMocha();
            };

            resizeWindow( nextSize );

        }, 500 );
    }

    window.addEventListener( 'resize', listener );

    resizeWindow( viewportTestsSizes.shift() );

}();