const noop = function () {};
const consoleWarn = console.warn;
const consoleError = console.error;
const consoleAssert = console.assert;

module.exports = {

    toggleConsole: mode => {

        if ( mode === 'on' ) {

            console.warn = consoleWarn;
            console.error = consoleError;
            console.assert = consoleAssert;

        }
        else {

            console.warn = noop;
            console.error = noop;
            console.assert = noop;

        }
    }
}