var gulp = require('gulp')
    , jshint = require('gulp-jshint')
    , rename = require('gulp-rename')
    , uglify = require('gulp-uglify');

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

gulp.task('js', function() {
    return gulp.src('src/*.js')
        .pipe(uglify({
            mangle: true
        }))
        .pipe(rename(function(path) {
            path.basename += '.min';
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('build', ['css', 'js']);

gulp.task('default', ['lint', 'build']);
