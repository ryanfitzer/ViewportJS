describe( 'API: Browser', function () {

    var width;
    var height;
    var noop = function () {};
    var viewport = window.viewport;
    var viewportSize = window.viewportSize;
    var consoleAssert = console.assert;

    const api = [
        'state',
        'remove',
        'matches',
        'current',
        'previous'
    ];

    function assertQueries( vp, name ) {

        expect( vp.matches( name ), 'Calling `matches( "' + name + '" )` should return `true`' ).to.be.true;
        expect( vp.current( name ), 'Calling `current( "' + name + '" )` should return `true`' ).to.be.true;
        expect( vp.current().name, 'Calling `current().name` should equal "' + name + '"' ).to.equal( name );

    }

    before( function () {

        width = viewportSize.getWidth();
        height = viewportSize.getHeight();

    } );

    it( 'should return the correct API when configuring viewports', function () {

        var vpjs = viewport( [
            {
                name: 'first',
                query: [ '(max-width:', width - 1, 'px)' ].join( '' )
            },
            {
                name: 'second',
                query: [ '(min-width:', width, 'px)' ].join( '' )
            }
        ] );

        api.forEach( function ( method ) {
            expect( vpjs[ method ], 'Expect ' + method + '() method to be a function' ).to.be.an( 'function' );
        });

    } );

    it( 'should query the correct viewport based on width', function () {

        var vpjs = viewport( [
            {
                name: 'first',
                query: [ '(max-width:', width - 1, 'px)' ].join( '' )
            },
            {
                name: 'second',
                query: [ '(min-width:', width, 'px)' ].join( '' )
            }
        ] );

        assertQueries( vpjs, 'second' );

    } );

    it( 'should query the correct viewport based on height', function () {

        var vpjs = viewport( [
            {
                name: 'first',
                query: [ '(max-height:', height - 1, 'px)' ].join( '' )
            },
            {
                name: 'second',
                query: [ '(min-height:', height, 'px)' ].join( '' )
            }
        ] );

        assertQueries( vpjs, 'second' );

    } );

    it( 'should query the correct viewport based on width and height', function () {

        var vpjs = viewport( [
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
        ] );

        assertQueries( vpjs, 'second' );

    } );

    it( 'should query the last matching viewport when multiple match', function () {

        var query = [
            [ '(min-width:', width, 'px) and ' ].join( '' ),
            [ '(min-height:', height, 'px)' ].join( '' )
        ].join( '' );

        var vpjs = viewport( [
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
        ] );

        assertQueries( vpjs, 'third' );

    } );

    it( 'should subscribe and unsubscribe to configured viewports', function () {

        var vpjs = viewport( [
            {
                name: 'first',
                query: [ '(min-width:', width, 'px)' ].join( '' )
            }
        ] );

        [
            vpjs( 'first', noop ),
            vpjs( 'first', noop ),
            vpjs( 'first', noop ),
            vpjs( noop ),
            vpjs( noop )
        ]
        .forEach( function ( unsubscribe, index ) {

            expect( unsubscribe(), 'Unsubscribing from a viewport should return the correct token.' ).to.equal( index );

        } );

    } );

    it( 'should return the correct API when subscribing to a media query', function () {

        var checkArgs = function ( state, instance ) {

            expect( state ).to.be.an( 'object', 'The `state` arg is an object.' );
            expect( state, 'The `state` arg contains the correct keys.' ).that.has.all.keys( 'matches' );
            expect( instance, 'The `instance` arg is a object.' ).to.be.an( 'object' );
            expect( instance, 'The `instance` arg contains the correct keys.' ).that.has.all.keys( 'matches', 'remove' );

        };

        var vp1 = viewport( [ '(max-width:', width - 1, 'px)' ].join( '' ), noop );
        var vp2 = viewport( [ '(min-width:', width, 'px)' ].join( '' ), checkArgs );

        expect( vp1.matches(), 'Calling `matches()` should return `false`' ).to.be.false;
        expect( vp2.matches(), 'Calling `matches()` should return `true`' ).to.be.true;

        expect( !!vp1.remove(), 'Calling `remove()` should return `false`' ).to.be.false;
        expect( !!vp2.remove(), 'Calling `remove()` should return `false`' ).to.be.false;

    } );

    it( 'should pass the correct arguments to configured subscribers', function () {

        var vpjs = viewport( [
            {
                name: 'first',
                query: [ '(min-width:', width, 'px)' ].join( '' )
            }
        ] );

        var checkArgs = function ( state, instance ) {

            expect( state ).to.be.an( 'object', 'The `state` arg is an object.' );
            expect( state, 'The `state` arg contains the correct keys.' ).that.has.all.keys( 'name', 'matches', 'current' );
            expect( instance, 'The `instance` arg is a function.' ).to.be.an( 'function' );

        };

        vpjs( 'first', checkArgs );
        vpjs( checkArgs );

    } );

    it( 'should remove all configured viewports, state, and handlers', function () {

        var vpjs = viewport( [
            {
                name: 'first',
                query: [ '(min-width:', width, 'px)' ].join( '' )
            }
        ] );

        vpjs( noop );
        vpjs( 'first', noop );

        console.assert = noop;

        expect( vpjs.remove(), 'Calling `remove()` should return `null`' ).to.be.null;

        expect( vpjs.state(), 'Calling `state()` should return an empty array' ).to.be.an( 'array' ).to.be.empty;
        expect( vpjs.state( 'first' ).name, 'Calling `state( name )` should return `undefined`' ).to.be.undefined;

        expect( vpjs.matches(), 'Calling `matches()` should return an empty array' ).to.be.an( 'array' ).to.be.empty;
        expect( vpjs.matches( 'first' ), 'Calling `matches( name )` should return `false`' ).to.be.false;

        expect( vpjs.current().name, 'Calling `current().name` should return `undefined`' ).to.be.undefined;
        expect( vpjs.current( 'first' ), 'Calling `current( name )` should return `false`' ).to.be.false;

        expect( vpjs.previous().name, 'Calling `previous().name` should return `undefined`' ).to.be.undefined;
        expect( vpjs.previous( 'first' ), 'Calling `previous( name )` should return `false`' ).to.be.false;

        console.assert = consoleAssert;

    } );

} );