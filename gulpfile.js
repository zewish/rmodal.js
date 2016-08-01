'use strict';

let gulp = require('gulp')
    , eslint = require('gulp-eslint')
    , rename = require('gulp-rename')
    , uglify = require('gulp-uglify')
    , replace = require('gulp-replace')
    , sourcemaps = require('gulp-sourcemaps')
    , karma = require('karma').Server
    , source = require('vinyl-source-stream')
    , buffer = require('vinyl-buffer')
    , rollup = require('rollup-stream')
    , buble = require('rollup-plugin-buble');

process.chdir(__dirname);

let bundle = (format) => {
    return rollup({
        entry: 'src/rmodal.js'
        , format: format
        , moduleName: 'RModal'
        , plugins: [ buble() ]
        , sourceMap: true
        , useStrict: false
    })
    .pipe(source('rmodal.js', './src'))
    .pipe(buffer())
    .pipe(replace(
        /@@VERSION@@/g
        , require('./package.json').version
    ));
}

gulp.task('lint', () => {
    return gulp.src('src/*.js')
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('css', () => {
    return gulp.src('src/*.css')
    .pipe(gulp.dest('dist'));
});

gulp.task('cjs', () => {
    return bundle('cjs')
    .pipe(sourcemaps.init({
        loadMaps: true
    }))
    .pipe(rename((path) => {
        path.basename = 'index';
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./'));
})

gulp.task('js', [ 'cjs' ], () => {
    return bundle('umd')
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('jsmin', [ 'js' ], () => {
    return gulp.src('dist/rmodal.js')
    .pipe(sourcemaps.init({
        loadMaps: true
    }))
    .pipe(uglify({
        mangle: true
    }))
    .pipe(rename((path) => {
        path.basename += '.min';
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist'));
});

gulp.task('build', [
    'css', 'jsmin'
]);

gulp.task('test', [ 'cjs' ], (done) => {
    new karma(
        {
            configFile: `${__dirname}/karma.conf.js`
            , singleRun: true
        }
        , done
    )
    .start();
});

gulp.task('default', [
    'lint', 'test', 'build'
]);