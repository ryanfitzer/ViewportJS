/*! {palceholder} */

;(function ( root, factory ) {
    
    if ( typeof define === 'function' && define.amd ) {

        // AMD. Register as an anonymous module.
        define( factory );
        
    } else {
        
        // Browser global
        root.pubsub = factory();
    }
    
}( this, function() {

    function PubSub() {

        this.channels = {}
        this.tokenUid = -1
    };
    
    PubSub.prototype = {

        subscribe: function( channel, method ) {

            var subscribers;

            this.tokenUid = this.tokenUid + 1;

            if ( !this.channels[ channel ] ) {
                this.channels[ channel ] = [];
            }

            subscribers = this.channels[ channel ];

            subscribers.push({
                token: this.tokenUid,
                method: method
            });

            return this.tokenUid;
        },

        unsubscribe: function( token ) {

            var subscribers;

            for ( var channel in this.channels ) {

                subscribers = this.channels[ channel ];

                if ( !subscribers ) { continue; }

                for ( var i = 0, len = subscribers.length; i < len; i++ ) {

                    if ( !( subscribers[i].token === token ) ) { continue; }

                    subscribers.splice( i, 1 );

                    return token;
                }
            }

            return this;
        },

        publish: function( channel, data ) {

            var subscribers = this.channels[ channel ]
                , subsLength = subscribers ? subscribers.length : 0
                ;

            if ( !subscribers ) { return false; }

            while ( subsLength-- ) {
                subscribers[ subsLength ].method.apply( subscribers[ subsLength ], [].slice.call( arguments, 1 ) );
            }

            return this;
        }
    }
	
	// Release it!
	return function() {

		return new PubSub();
	};

}));