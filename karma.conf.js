module.exports = function(config) {
    config.set({
        basePath: ''

        , frameworks: [
            'mocha'
            , 'chai'
            , 'sinon'
        ]

        , files: [
            'src/*.js',
            'test/*.js'
        ]

        , exclude: [
        ]

        , preprocessors: {
            'src/*.js': 'coverage'
        }

        , reporters: [
            'progress'
            , 'coverage'
        ]

        , coverageReporter: {
            type : 'html',
            dir : 'build/coverage'
        }

        , browsers: [
            'PhantomJS'
        ]

        , port: 9876
        , autoWatch: true
        , singleRun: false

        , colors: true
        , logLevel: config.LOG_INFO
    });
};
