module.exports = function(config) {
    config.set({
        basePath: ''

        , frameworks: [
            'mocha'
            , 'chai'
            , 'sinon'
        ]

        , files: [
            'test/rmodal.js'
            , 'test/rmodal.test.js'
        ]

        , exclude: []

        , preprocessors: {
            'test/rmodal.js': [ 'coverage' ]
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
        , logLevel: config.LOG_DEBUG

        , client: {
            captureConsole: true
            , mocha: {
                bail: true
            }
        }
    });
};
