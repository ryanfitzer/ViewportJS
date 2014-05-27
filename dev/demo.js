var myVPOne = viewport([
    {
        name: 'small',
        width: [ 0, 480 ]
    },
    {
        name: 'medium',
        width: [ 481, 768 ]
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

var handler = function( isCurrent, vp ) {

    console.log( vp.name + ': ' + isCurrent );
    
    // IE7 logging
    // var results = document.getElementById( 'breakpoints' )
    //     , msg = vp.name + ': ' + isCurrent
    //     ;
    // 
    // results.innerHTML = results.innerHTML + '<p>' + vp.name + ': ' + isCurrent + '</p>';
};

var isLazy
    , myVPOne1a
    ;

var myVPOne1 = myVPOne.subscribe( 'small', function( isCurrent, vp ) {
    
    console.log( vp.name + ': ' + isCurrent );
    
    if ( !isCurrent || isLazy ) return;
    
    isLazy = true;
    
    myVPOne1a = myVPOne.subscribe( 'small', function( isCurrent ) {
        
        console.log('I be a lazy subscriber, YO!');

        myVPOne.unsubscribe( myVPOne1a );
    });
});

var myVPOne2 = myVPOne.subscribe( 'medium', handler );
var myVPOne3 = myVPOne.subscribe( 'large', handler );

var myVPTwo1 = myVPTwo.subscribe( 'small-one', handler );
var myVPTwo2 = myVPTwo.subscribe( 'medium-one', handler );
var myVPTwo3 = myVPTwo.subscribe( 'height-one', handler );


