define(
    
    [
        'intern!object',
        'intern/chai!assert',
        'viewport'
    ],
    
    function ( registerSuite, assert, viewport ) {
        
        var width = window.innerWidth || document.documentElement.clientWidth
            , height = window.innerHeight || document.documentElement.clientHeight
            ;
        
        registerSuite({
            
            name: 'viewport',
            
            create: function() {
                
                var config = [
                    {
                        name: 'first',
                        width: [ 0, width - 1 ]
                    },
                    {
                        name: 'second',
                        width: [ width ]
                    }
                ];
                
                var vp = viewport( config );
                
                assert.isObject(
                    vp,
                    'viewport should return an object.'
                );
                assert.isObject(
                    vp.vps,
                    'viewport should return an object containing the `vps` object.'
                );
                assert.strictEqual(
                    vp.viewports,
                    config, 
                    'viewport should return an object containing the original configuration array.'
                );
                assert.isFunction(
                    vp.is,
                    'viewport should return an object containing the `is` method.'
                );
                assert.isFunction(
                    vp.current,
                    'viewport should return an object containing the `current` method.'
                );
                assert.isFunction(
                    vp.matches,
                    'viewport should return an object containing the `matches` method.'
                );
                assert.isFunction(
                    vp.subscribe,
                    'viewport should return an object containing the `subscribe` method.'
                );
                assert.isFunction(
                    vp.unsubscribe,
                    'viewport should return an object containing the `unsubscribe` method.'
                );
            },
            
            width: function() {
                
                var config = [
                    {
                        name: 'first',
                        width: [ 0, width - 1 ]
                    },
                    {
                        name: 'second',
                        width: [ width ]
                    }
                ];
                
                var vp = viewport( config );

                assert.strictEqual(
                    vp.current(),
                    vp.vps[ 'second' ],
                    'the `current` method should return the correct viewport object based on width.'
                );
                assert.strictEqual(
                    vp.matches( 'second' ),
                    true,
                    'the `matches` method should return `true` for viewport name provided.'
                );
                assert.strictEqual(
                    vp.is( 'second' ),
                    true,
                    'the `is` method should return `true` for viewport name provided.'
                );
            },
            
            height: function() {
                
                var config = [
                    {
                        name: 'first',
                        height: [ 0, height - 1 ]
                    },
                    {
                        name: 'second',
                        height: [ height ]
                    }
                ];
                
                var vp = viewport( config );

                assert.strictEqual(
                    vp.current(),
                    vp.vps[ 'second' ],
                    'the `current` method should return the correct viewport object based on height.'
                );
                assert.strictEqual(
                    vp.matches( 'second' ),
                    true,
                    'the `matches` method should return `true` for viewport name provided.'
                );
                assert.strictEqual(
                    vp.is( 'second' ),
                    true,
                    'the `is` method should return `true` for viewport name provided.'
                );
            },
            
            widthHeight: function() {
                
                var config = [
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
                ];
                
                var vp = viewport( config );

                assert.strictEqual(
                    vp.current(),
                    vp.vps[ 'second' ],
                    'the `current` method should return the correct viewport object based on width and height.'
                );
                assert.strictEqual(
                    vp.matches( 'second' ),
                    true,
                    'the `matches` method should return `true` for viewport name provided.'
                );
                assert.strictEqual(
                    vp.is( 'second' ),
                    true,
                    'the `is` method should return `true` for viewport name provided.'
                );
            },
            
            multipleMatches: function() {
                
                var config = [
                    {
                        name: 'first',
                        height: [ height ],
                        width: [ width ]
                    },
                    {
                        name: 'second',
                        height: [ height ],
                        width: [ width ]
                    }
                ];
                
                var vp = viewport( config );

                assert.strictEqual(
                    vp.current(),
                    vp.vps[ 'second' ],
                    'the `current` method should return the last viewport object when multiple match.'
                );
                assert.strictEqual(
                    vp.matches( 'second' ),
                    true,
                    'the `matches` method should return `true` for viewport name provided.'
                );
                assert.strictEqual(
                    vp.is( 'second' ),
                    true,
                    'the `is` method should return `true` for viewport name provided.'
                );
            }
        
        });
});