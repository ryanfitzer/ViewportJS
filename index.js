'use strict';

if ( process.env.NODE_ENV === 'production' ) {

    module.exports = require( './dist/viewport.min.js' );

}
else {

    module.exports = require( './dist/viewport.js' );

}