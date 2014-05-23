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
]);

var myVPTwo = viewport([
    {
        name: 'small-one',
        width: [ 320 ]
    },
    {
        name: 'medium-one',
        width: [ 1250 ]
    },
    {
        name: 'height-one',
        width: [ 600 ],
        height: [ 600 ]
    }
]);

var handler = function( matches, vp ) {

    console.log( vp.name + ': ' + matches );
    // var results = document.getElementById( 'breakpoints' )
    //     , msg = vp.name + ': ' + matches
    //     ;
    // 
    // results.innerHTML = results.innerHTML + '<p>' + vp.name + ': ' + matches + '</p>';
};

var myVPOne1 = myVPOne.subscribe( 'small', handler );
var myVPOne2 = myVPOne.subscribe( 'medium', handler );
var myVPOne3 = myVPOne.subscribe( 'large', handler );


var myVPTwo1 = myVPTwo.subscribe( 'small-one', handler );
var myVPTwo2 = myVPTwo.subscribe( 'medium-one', handler );
var myVPTwo3 = myVPTwo.subscribe( 'height-one', handler );


