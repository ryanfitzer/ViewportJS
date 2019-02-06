// Karma configuration
module.exports = function ( config ) {

    config.set( {

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        // browsers: [
        //     'ChromeHeadless',
        //     'Firefox',
        //     'Safari'
        // ],

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        // https://github.com/litixsoft/karma-detect-browsers
        detectBrowsers: {

            // Enable/disable, default is true
            enabled: true,

            // Enable/disable phantomjs support, default is true
            usePhantomJS: false,

            // Use headless mode, for browsers that support it, default is false
            preferHeadless: true,

            // Ppost processing of browsers list where you can edit the list of browsers used by karma
            postDetection: function ( availableBrowsers ) {

                console.log( 'availableBrowsers', availableBrowsers );

                /* Karma configuration with custom launchers
                customLaunchers: {
                  IE9: {
                    base: 'IE',
                    'x-ua-compatible': 'IE=EmulateIE9'
                  }
                }
                */

                // // Add IE Emulation
                // var result = availableBrowsers;
                //
                // if ( availableBrowsers.indexOf( 'IE' ) > -1 ) {
                //
                //     result.push( 'IE9' );
                //
                // }
                //
                // // Remove PhantomJS if another browser has been detected
                // if ( availableBrowsers.length > 1 && availableBrowsers.indexOf( 'PhantomJS' ) > -1 ) {
                //
                //     var i = result.indexOf( 'PhantomJS' );
                //
                //     if ( i !== -1 ) {
                //
                //         result.splice( i, 1 );
                //
                //     }
                //
                // }

                return availableBrowsers;

            }
        },

        // list of files / patterns to exclude
        exclude: [],

        // list of files / patterns to load in the browser
        files: [
            {
                watched: false,
                pattern: 'test/lib/viewport-size.js'
            },
            'src/viewport.js',
            'test/api-browser.js'

        ],

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: [
            'chai',
            'mocha',
            'detectBrowsers'
        ],

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // web server port
        port: 9876,

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // 'src/viewport.js': [ 'coverage' ]
        },

        plugins: [
            'karma-chai',
            'karma-mocha',
            'karma-chrome-launcher',
            'karma-edge-launcher',
            'karma-firefox-launcher',
            'karma-ie-launcher',
            'karma-safari-launcher',
            'karma-safaritechpreview-launcher',
            'karma-opera-launcher',
            'karma-detect-browsers'
        ],

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: [
            // 'coverage',
            'progress'
        ],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false

    } );

};
