var gulp = require('gulp');
var less = require('gulp-less');
var miniCss = require('gulp-mini-css');
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
var plumber = require('gulp-plumber');

gulp.task('less',function(){
	gulp.src('./public/less/tsb.less')
		.pipe(plumber())
		.pipe(less())
		.pipe(miniCss({ext:'.min.css'}))
		.pipe(gulp.dest('./public/build/css'))
});

gulp.task('mainJs', function() {
	gulp.src('./public/js/main.js')
		.pipe(plumber())
		.pipe(babel())
		.pipe(browserify({
			transform: 'reactify',
			debug: true
		}))
		.pipe(gulp.dest('./public/build/js'))
});

gulp.task('loginJs', function () {
	gulp.src('./public/js/main.js')
		.pipe(plumber())
		.pipe(babel())
		.pipe(browserify({
			transform: 'reactify',
			debug: true
		}))
		.pipe(gulp.dest('./public/build/js'))
});

gulp.task('jsmini', function() {
	gulp.src('./public/js/main.js')
		.pipe(babel())
		.pipe(browserify({
			transform: 'reactify',
			debug:true
		}))
		.pipe(gulp.dest('./public/build/js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/build/js'));
	gulp.src('./public/js/login.js')
		.pipe(babel())
		.pipe(browserify({
			transform: 'reactify',
			debug:true
		}))
		.pipe(gulp.dest('./public/build/js'))
		.pipe(uglify())
		.pipe(gulp.dest('./public/build/js'));
});
gulp.task('default', ['less', 'loginJs', 'mainJs']);
gulp.task('product', ['less', 'jsmini']);

gulp.task('watch', function () {
	gulp.watch('./public/js/*.js', ['mainJs']);
	gulp.watch('./public/js/login.js', ['loginJs']);
	gulp.watch ('./public/less/*.less', ['less']);
});

gulp.task('watchless', function () {
	gulp.watch('./public/less/*.less', ['less']);
});
