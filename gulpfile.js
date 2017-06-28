/**
 * Load Gulp and Gulp-adjacent dependencies
 */
var gulp           = require('gulp')
var beautify       = require('gulp-jsbeautifier')
var connect        = require('gulp-connect')
var cssnano        = require('gulp-cssnano')
var inky           = require('inky')
var sass           = require('gulp-sass')
var sassAssetFuncs = require('node-sass-asset-functions')
var sassglob       = require('gulp-sass-glob')
var twig           = require('gulp-twig')

/**
 * Sass to CSS compilation, minification, and prefixing
 */
gulp.task('css', function() {
  gulp.src('src/assets/sass/*.scss')
    .pipe(sassglob())
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano({
      autoprefixer: {
        browsers: ['last 2 versions'],
        cascade: false
      },
      discardComments: {
        removeAll: true
      },
			minimiseWhitespace: {disable: true},
    }))
    .pipe(gulp.dest('src/views/.cache/css'))
    .pipe(connect.reload())
})

/**
 * Build HTML emails
 */
gulp.task('build', function () {
  gulp.src([
    'src/views/**/*.twig',
    '!src/views/**/_*.twig',
  ])
    .pipe(twig({
      base: 'src/views',
      data: {},
    }))
    .pipe(inky())
		.pipe(beautify())
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload())
})

/**
 * Serve requests
 */
gulp.task('serve', function () {
  connect.server({
    root: 'dist',
    livereload: true,
  })
})

/**
 * Watch for changes and automatically reload the browser
 */
gulp.task('watcher', function () {
  gulp.watch('src/views/**/*', ['build'])
  gulp.watch('src/assets/sass/**/*', ['css'])
})

/**
 * Set up default task
 */
gulp.task('default', [
	'css',
  'build',
])

/**
 * Set up watch task
 */
gulp.task('watch', [
  'default',
  'watcher',
	'serve',
])
