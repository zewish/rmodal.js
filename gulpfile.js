var gulp = require('gulp')
    , jshint = require('gulp-jshint')
    , rename = require('gulp-rename')
    , uglify = require('gulp-uglify')
    , replace = require('gulp-replace')
    , karma = require('karma');

process.chdir(__dirname);

gulp.task('lint', function() {
    return gulp.src('src/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('css', function() {
    return gulp.src('src/*.css')
        .pipe(gulp.dest('dist'));
});

var version = function() {
    return replace(
        /@@VERSION@@/g
        , require('./package.json').version
    );
}

gulp.task('jsmin', function() {
    return gulp.src('src/*.js')
        .pipe(version())
        .pipe(uglify({
            mangle: true
        }))
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('js', [ 'jsmin' ], function() {
    return gulp.src('src/*.js')
        .pipe(version())
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['css', 'js']);

gulp.task('test', function(done) {
    var server = new karma.Server(    {
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
    server.start();
});

gulp.task('default', ['lint', 'test', 'build']);
