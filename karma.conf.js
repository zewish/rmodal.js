module.exports = (config) => {
  const opts = {
    basePath: '',
    frameworks: [
      'mocha',
      'chai',
      'sinon',
      'commonjs'
    ],
    files: [
      'test/*.test.js',
      './index.js'
    ],
    exclude: [],
    preprocessors: {
      'test/*.test.js': [ 'commonjs' ],
      './index.js': [
        'coverage',
        'commonjs'
      ]
    },
    reporters: [
      'mocha',
      'coverage'
    ],
    coverageReporter: {
      type: 'html',
      dir: 'coverage/'
    },
    browsers: [ 'PhantomJS' ],
    phantomjsLauncher: {
      exitOnResourceError: true
    },
    captureTimeout: 60000,
    port: 9876,
    autoWatch: true,
    singleRun: false,
    colors: true,
    logLevel: config.LOG_INFO,
    client: {
      captureConsole: true,
      mocha: {
        bail: false
      }
    }
  };

  if (process.env.CI) {
    opts.coverageReporter.type = 'lcov';
    opts.reporters.push('coveralls');
  }

  config.set(opts);
};
