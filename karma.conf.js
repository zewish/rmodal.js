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
            , 'progress'
        ]

        , coverageReporter: {
            type: 'html'
            , dir : 'build/coverage'
        }

        , browsers: ['PhantomJS']
        , captureTimeout: 60000

        , port: 9876
        , autoWatch: true
        , singleRun: false

        , colors: true
        , logLevel: config.LOG_INFO
    });
};
