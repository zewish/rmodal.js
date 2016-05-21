'use strict';

module.exports = function(config) {
    let opts = {
        basePath: ''

        , frameworks: [
            'mocha'
            , 'chai'
            , 'sinon'
            , 'commonjs'
        ]

        , files: [
            'test/*.test.js'
            , './index.js'
        ]

        , exclude: []

        , preprocessors: {
            'test/*.test.js': [ 'commonjs' ]
            , './index.js': [
                'coverage'
                , 'commonjs'
            ]
        }

        , reporters: [
            'coverage'
            , 'progress'
        ]

        , coverageReporter: {
            type: 'html'
            , dir: 'coverage/'
        }

        , browsers: [ 'PhantomJS' ]
        , phantomjsLauncher: {
            exitOnResourceError: true
        }
        , captureTimeout: 60000

        , port: 9876
        , autoWatch: true
        , singleRun: false

        , colors: true
        , logLevel: config.LOG_INFO

        , client: {
            captureConsole: true
            , mocha: {
                bail: true
            }
        }
    };

    if (process.env.TRAVIS) {
        opts.coverageReporter.type = 'lcov';
        opts.reporters.push('coveralls');
    }

    config.set(opts);
};
