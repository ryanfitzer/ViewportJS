module.exports = function( grunt ) {

    /* Configure */
    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),

        uglify: {
            options: {
                report: 'gzip', // requires using `grunt --verbose`
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
