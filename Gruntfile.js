module.exports = function ( grunt ) {

    grunt.initConfig( {

        copy: {
            dist: {
                src: './src/viewport.js',
                dest: './dist/viewport.js'
            }
        },
        uglify: {
            options: {
                report: 'gzip', // requires `grunt --verbose`
                compress: {
                    drop_console: true
                }
            },
            dist: {
                src: './src/viewport.js',
                dest: './dist/viewport.min.js'
                // files: {
                //     './dist/viewport.min.js': [ './src/viewport.js' ]
                // }
            }
        }
    } );

    grunt.loadNpmTasks( 'grunt-contrib-copy' );

    grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    grunt.registerTask( 'default', [
        'copy',
        'uglify'
    ] );

};
