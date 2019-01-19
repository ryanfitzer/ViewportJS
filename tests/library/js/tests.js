!function () {

    var noop = function () {};

    mocha.setup({
      ui: 'bdd'
    });

    window.assert = chai.assert;

    describe( 'API: Instance', function() {

        var width;
        var height;

        beforeEach( function () {

            width = viewportSize.getWidth();
            height = viewportSize.getHeight();
        });

        it( 'should return the correct viewport based on width', function() {

            var vp = viewport([
                {
                    name: 'first',
                    query: [ '(max-width:', width - 1, 'px)' ].join( '' )
                },
                {
                    name: 'second',
                    query: [ '(min-width:', width, 'px)' ].join( '' )
                }
            ]);

            assert.isTrue( vp.matches( 'second' ) );
            assert.isTrue( vp.current( 'second' ) );
            assert.equal( vp.current().name, 'second' );
        });

        it( 'should return the correct viewport based on height', function() {

            var vp = viewport([
                {
                    name: 'first',
                    query: [ '(max-height:', height - 1, 'px)' ].join( '' )
                },
                {
                    name: 'second',
                    query: [ '(min-height:', height, 'px)' ].join( '' )
                }
            ]);

            assert.isTrue( vp.matches( 'second' ) );
            assert.isTrue( vp.current( 'second' ) );
            assert.equal( vp.current().name, 'second' );
        });

        it( 'should return the correct viewport based on width and height', function() {

            var vp = viewport([
                {
                    name: 'first',
                    query: [
                        [ '(max-width:', width - 1, 'px) and ' ].join( '' ),
                        [ '(max-height:', height - 1, 'px)' ].join( '' )
                    ].join( '' )
                },
                {
                    name: 'second',
                    query: [
                        [ '(max-width:', width, 'px) and ' ].join( '' ),
                        [ '(max-height:', height, 'px)' ].join( '' )
                    ].join( '' )
                }
            ]);

            assert.isTrue( vp.matches( 'second' ) );
            assert.isTrue( vp.current( 'second' ) );
            assert.equal( vp.current().name, 'second' );
        });

        it( 'should return the last matching viewport when multiple match', function() {

            var query = [
                [ '(min-width:', width, 'px) and ' ].join( '' ),
                [ '(min-height:', height, 'px)' ].join( '' )
            ].join( '' );

          var vp = viewport([
            {
              name: 'first',
              query: query
            },
            {
              name: 'second',
              query: query
            },
            {
              name: 'third',
              query: query
            }
          ]);

          assert.isTrue( vp.matches( 'third' ) );
          assert.isTrue( vp.current( 'third' ) );
          assert.equal( vp.current().name, 'third' );

        });

        it( 'should subscribe and unsubscribe to a viewport', function() {

            var vp = viewport([
                {
                    name: 'first',
                    query: [ '(min-width:', width, 'px)' ].join( '' )
                }
            ]);

            [
                vp.subscribe( 'first', noop ),
                vp.subscribe( 'first', noop ),
                vp( 'first', noop ),
                vp.subscribeAll( noop ),
                vp( noop )
            ]
            .forEach( function ( unsubscribe, index ) {
                assert.ok( unsubscribe() === index );
            });

        });

    });

    describe( 'API: Static', function() {

        var width;
        var height;

        beforeEach( function () {

            width = viewportSize.getWidth();
            height = viewportSize.getHeight();
        });

        it( 'should subscribe and match the correct viewport using the static `subscribe` method.', function () {

            var vp1 = viewport( [ '(max-width:', width - 1, 'px)' ].join( '' ), noop );
            var vp2 = viewport( [ '(min-width:', width, 'px)' ].join( '' ), noop );

            assert.isTrue( !vp1.matches() );
            assert.isTrue( vp2.matches() );
            assert.isFalse( !!vp1.remove() );
            assert.isFalse( !!vp2.remove() );

        });

    });

    var sizeDelta = {
        width: window.outerWidth - window.innerWidth,
        height: window.outerHeight - window.innerHeight
    }

    var viewportTests = {

        '480x700': {
            'small': 'match',
            'medium': 'current',
            'large': 'not match',
            'xlarge': 'not match'
        },
        '600x700': {
            'small': 'not match',
            'medium': 'match',
            'large': 'current',
            'xlarge': 'not match'
        },
        '601x700': {
            'small': 'not match',
            'medium': 'not match',
            'large': 'current',
            'xlarge': 'not match'
        },
        '768x700': {
            'small': 'not match',
            'medium': 'not match',
            'large': 'current',
            'xlarge': 'not match'
        },
        '769x700': {
            'small': 'not match',
            'medium': 'not match',
            'large': 'not match',
            'xlarge': 'not match'
        },
        '924x700': {
            'small': 'not match',
            'medium': 'not match',
            'large': 'not match',
            'xlarge': 'not match'
        },
        '925x700': {
            'small': 'not match',
            'medium': 'not match',
            'large': 'not match',
            'xlarge': 'current'
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
        'current': {
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
        'large',
        'xlarge'
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

                return mocha.run();
            };

            resizeWindow( nextSize );

        }, 500 );
    }

    window.addEventListener( 'resize', listener );

    resizeWindow( viewportTestsSizes.shift() );

}();