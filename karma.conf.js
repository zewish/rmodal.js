module.exports = function(config) {
    config.set({
        basePath: ''

        , frameworks: [
            'mocha'
            , 'chai'
            , 'sinon'
        ]

        , files: [
            'src/*.js'
            , 'test/*.js'
        ]

        , exclude: []

        , preprocessors: {
            'src/*.js': ['coverage']
        }

        , reporters: [
            'coverage'
            //, 'coveralls'
            , 'progress'
        ]

        , coverageReporter: {
            type: 'html'
            , dir: 'coverage/'
        }

        , browsers: ['PhantomJS']
        , phantomjsLauncher: {
            exitOnResourceError: true
        }
        , captureTimeout: 60000

        , port: 9876
        , autoWatch: true
        , singleRun: false

        , colors: true
        , logLevel: config.LOG_INFO
    });
};
