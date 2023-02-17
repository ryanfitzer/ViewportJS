'use strict';

if ( process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test' ) {

    module.exports = require( './dist/viewport.min.js' );

}
else {

    module.exports = require( './dist/viewport.js' );

}