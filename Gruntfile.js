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
        }
    });

    grunt.loadNpmTasks( 'grunt-contrib-uglify' );

    grunt.registerTask( 'default', [
        'uglify'
    ]);
};
