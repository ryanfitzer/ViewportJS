const gzipSize = require( 'gzip-size' );
const prettyBytes = require( 'pretty-bytes' );

module.exports = function( grunt ) {

    /* Configure */
    grunt.initConfig({

        uglify: {
            options: {
                report: 'gzip',
                compress: true
            },
            dist: {
                files: {
                    'viewport.min.js': [ 'viewport.js' ]
                }
            }
        },
        gzipSize: {
            dist: {
                src: [ 'viewport.js', 'viewport.min.js' ]
            }
        }
    });

    grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    grunt.registerMultiTask( 'gzipSize', 'Log the gzip size of a file', function () {

        let promises;
        const paths = [];
        const done = this.async();

        this.files.forEach( files => {

            promises = files.src.map( file => {

                paths.push( file );
                return gzipSize.file( file )
            });
        });

        Promise.all( promises )
        .then( values => {

            values.forEach( ( value, index ) => grunt.log.writeln( `${ paths[ index ] }: ${ prettyBytes( value ) }` ) )
            done();
        });
    });

    grunt.registerTask( 'default', [
        'uglify',
        'gzipSize'
    ]);
};
