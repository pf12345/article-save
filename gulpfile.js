var gulp = require('gulp');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');

gulp.task('mainJs', function() {
	gulp.src('./public/js/login.js')
		.pipe(plumber())
		.pipe(babel())
		.pipe(browserify({
			transform: 'reactify',
			debug: true
		}))
		.pipe(gulp.dest('./public/build/js'))
});

gulp.task('default', ['mainJs']);

gulp.task('watch', function () {
	//gulp.watch('./public/js/*.js', ['mainJs']);
});
