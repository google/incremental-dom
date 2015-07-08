var gulp = require('gulp');
var rename = require('gulp-rename');
var vulcanize = require('gulp-vulcanize');
 
function bundle() {
  return gulp.src('index-raw.html')
    .pipe(vulcanize({
        excludes: [],
        inlineScripts: true,
        inlineCss: true,
        stripComments: true
    }))
   .pipe(rename('index.html'))
   .pipe(gulp.dest('.'));
}

gulp.task('bundle', bundle);
gulp.task('default', ['bundle']);
