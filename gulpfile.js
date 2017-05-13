var gulp     = require('gulp');
var minify   = require('gulp-minify');
var cleanCSS = require('gulp-clean-css');

// gulp.task('default', function() {
//   // place code for your default task here
// });

gulp.task('default', ['compressJs', 'minify-css', 'watch']);

gulp.task('compressJs', function() {
    gulp.src('src/**/*.js')
        .pipe(minify({
            ext:{
                src:'-debug.js',
                min:'.js'
            }
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('minify-css', function() {
  return gulp.src('src/**/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', function(){
    gulp.watch('src/**', ['compressJs', 'minify-css']);
});
