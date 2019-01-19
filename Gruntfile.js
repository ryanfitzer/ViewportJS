module.exports = function ( grunt ) {

    grunt.initConfig( {

        uglify: {
            options: {
                report: 'gzip', // requires `grunt --verbose`
                compress: {
                    drop_console: true
                }
            },
            dist: {
                files: {
                    './dist/viewport.min.js': [ 'viewport.js' ]
                }
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    grunt.registerTask( 'default', [
        'uglify'
    ] );

};
