/*eslint-env node */

const gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  browserSync = require('browser-sync').create(),
  eslint = require('gulp-eslint'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  babel = require('gulp-babel'),
  sourcemaps = require('gulp-sourcemaps'),
  jasmine = require('gulp-jasmine-phantom');

// Static Server + watching scss/html files
gulp.task('serve', ['styles'], function() {

  browserSync.init({
    proxy: 'localhost:1337'
  });

  gulp.watch('assets/sass/**/*.scss', ['styles']);
  gulp.watch('assets/js/**/*.js', ['lint']);
  gulp.watch('views/**/*.ejs').on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('styles', function() {
  return gulp.src('assets/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error',sass.logError))
    .pipe(autoprefixer({ browsers: ['last 4 versions'] }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp/public/styles'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function () {
  gulp.src('assets/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('.tmp/public/js'));
});

gulp.task('lint', function() {
  // ESLint ignores files with "node_modules" paths.
  // So, it's best to have gulp ignore the directory as well.
  // Also, Be sure to return the stream from the task;
  // Otherwise, the task may end before the stream has finished.
  return gulp.src(['assets/js/**/*.js','!node_modules/**'])
  // eslint() attaches the lint output to the "eslint" property
  // of the file object so it can be used by other modules.
    .pipe(eslint())
    // eslint.format() outputs the lint results to the console.
    // Alternatively use eslint.formatEach() (see Docs).
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on
    // lint error, return the stream and pipe to failAfterError last.
    //.pipe(eslint.failOnError());
});

gulp.task('tests', function () {

});

gulp.task('default', ['serve', 'lint']);
