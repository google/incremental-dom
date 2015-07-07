var gulp = require('gulp');
var vulcanize = require('gulp-vulcanize');
 
function bundle() {
  return gulp.src('src/index.html')
    .pipe(vulcanize({
        abspath: '.',
        excludes: [],
        inlineScripts: true,
        inlineCss: true,
        stripComments: true
    }))
   .pipe(gulp.dest('.'));
}

gulp.task('bundle', bundle);
gulp.task('default', ['bundle']);
