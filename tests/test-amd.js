require(
    
    [ '../viewport' ],
    
    function( Viewport ) {

        var myViewport = Viewport([
            {
                name: 'xs',
                width: [ 0 ],
                mediaExp: '( min-width:0px )'
            },
            {
                name: 's',
                width: [ 480 ],
                mediaExp: '( min-width:480px )',
                condition: function() {
                  return !Modernizr.touch;
                }
            },
            {
                name: 's-m',
                width: [ 480, 767 ],
                mediaExp: '( min-width:480px ) and ( max-width:767px )'
            },
            {
                name: 'm',
                width: [ 768 ],
                mediaExp: '( min-width:768px )'
            },
            {
                name: 'l',
                width: [ 1024 ],
                height: [ 1085 ],
                mediaExp: '( min-width:1024px ) and ( min-height:1085px )'
            }
        ]);
        
        console.log('\nviewport instance:', myViewport );
        
        console.log('\nCurrent viewport:', myViewport.current() );
    }
);