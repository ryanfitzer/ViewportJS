const { expect } = require( 'chai' );
const viewport = require( '../src/viewport' );
const { toggleConsole } = require( './lib/utils' );

describe( 'API: Node', function () {

    let vpjs;

    const api = [
        'state',
        'remove',
        'matches',
        'current',
        'previous'
    ];

    before( function () {

        vpjs = viewport( [
            {
                name: 'first',
                query: '(max-width: 100px)'
            },
            {
                name: 'second',
                query: '(max-width: 101px)'
            }
        ] );


    } );

    it( 'should return the correct API when configuring viewports', function () {

        api.forEach( ( method ) => {

            expect( vpjs[ method ], `Expect ${ method }() method to be a function` ).to.be.an( 'function' );

        });

    } );

    it( 'should return the correct values from query methods', function () {

        toggleConsole( 'off' );

        expect( vpjs.state(), 'Calling `state()` should return an empty array' ).to.be.an( 'array' ).to.be.empty;
        expect( vpjs.state( 'first' ).name, 'Calling `state( name )` should return `undefined`' ).to.be.undefined;

        expect( vpjs.matches(), 'Calling `matches()` should return an empty array' ).to.be.an( 'array' ).to.be.empty;
        expect( vpjs.matches( 'first' ), 'Calling `matches( name )` should return `false`' ).to.be.false;

        expect( vpjs.current().name, 'Calling `current().name` should return `undefined`' ).to.be.undefined;
        expect( vpjs.current( 'first' ), 'Calling `current( name )` should return `false`' ).to.be.false;

        expect( vpjs.previous().name, 'Calling `previous().name` should return `undefined`' ).to.be.undefined;
        expect( vpjs.previous( 'first' ), 'Calling `previous( name )` should return `false`' ).to.be.false;

        expect( vpjs.remove(), 'Calling `remove()` should return an empty `undefined`' ).to.be.undefined;

        toggleConsole( 'on' );

    });

    it( 'should pass the correct arguments to subscribers', function () {

        var checkArgs = function ( state, instance ) {

            expect( state ).to.be.an( 'object', 'The `state` arg is an object.' );
            expect( state, 'The `state` arg contains the correct keys.' ).that.has.all.keys( 'name', 'matches', 'current' );
            expect( instance, 'The `instance` arg is a function.' ).to.be.an( 'function' );

        };

        toggleConsole( 'off' );

        vpjs( 'first', checkArgs );
        vpjs( 'second', checkArgs );
        vpjs( checkArgs );

        toggleConsole( 'on' );


    } );

    it( 'should return the correct API when subscribing to a media query', function () {

        const checkArgs = function ( state, instance ) {

            expect( state ).to.be.an( 'object', 'The `state` arg is an object.' );
            expect( state, 'The `state` arg contains the correct keys.' ).that.has.all.keys( 'matches' );
            expect( instance, 'The `instance` arg is a object.' ).to.be.an( 'object' );
            expect( instance, 'The `instance` arg contains the correct keys.' ).that.has.all.keys( 'matches', 'remove' );

        };

        toggleConsole( 'off' );

        const vp = viewport( '(max-width: 100px)', checkArgs );

        expect( vp.matches(), 'Calling `matches()` should return `undefined`' ).to.be.undefined;
        expect( vp.remove(), 'Calling `remove()` should return `undefined`' ).to.be.undefined;

        toggleConsole( 'on' );

    } );

} );