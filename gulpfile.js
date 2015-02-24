var gulp = require('gulp')
    , uglify = require('gulp-uglify');

process.chdir(__dirname);

gulp.task('css', function() {
    return gulp.src('src/*.css')
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function() {
    return gulp.src('src/*.js')
        .pipe(uglify({
            mangle: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['css', 'js']);