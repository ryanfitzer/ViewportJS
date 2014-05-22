var myVPOne = viewport([
    {
        name: 'small',
        width: [ 0, 480 ]
    },
    {
        name: 'medium',
        width: [ 0, 768 ]
    },
    {
        name: 'large',
        width: [ 769 ]
    }
], { debug: false } );

var myVPTwo = viewport([
    {
        name: 'small-one',
        width: [ 0, 320 ]
    },
    {
        name: 'medium-one',
        width: [ 0, 699 ]
    }
], { debug: false } );

var handler = function( matches, vp ) {
    console.log( vp.name + ': ' + matches );
};

var myVPOne1 = myVPOne.subscribe( 'small', handler );
var myVPOne2 = myVPOne.subscribe( 'medium', handler );
var myVPOne3 = myVPOne.subscribe( 'large', handler );


var myVPTwo1 = myVPTwo.subscribe( 'small-one', handler );
var myVPTwo2 = myVPTwo.subscribe( 'medium-one', handler );
var myVPTwo3 = myVPTwo.subscribe( 'medium-one', handler );


