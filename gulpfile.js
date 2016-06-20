'use strict';

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	gutil = require('gulp-util'),
	uglify =  require('gulp-uglify'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	rename = require('gulp-rename'),
	imagemin = require('gulp-imagemin'),
	strip = require('gulp-strip-comments'),
	mainBowerFiles = require('main-bower-files'),
	browserSync = require('browser-sync'),
	browserify = require('gulp-browserify'),
	vueify = require('vueify'),
	fs = require('fs');



// Set order for JS files
var jsFiles = [
	'src/js/vendor/jquery-2.2.0.js',
	'src/js/vendor/modernizer.js',
	'src/js/vendor/TweenMax.js',
	'src/js/vendor/TimelineMax.min.js',
	'src/js/vendor/ScrollMagic.js',
	'src/js/vendor/animation.gsap.js',
	'src/js/vendor/jquery.waypoints.min.js'
]


gulp.task('browserSync', function(){
	browserSync({
		server: {
			baseDir: './public'
		}
	})
});

gulp.task('styles', function(){

	gulp.src('src/scss/style.scss')
		.pipe(sass({outputStyle: 'compressed'}))
		.on('error', gutil.log)
		.pipe(autoprefixer({
			browsers: ['last 3 versions'],
			cascade: false
		}))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('public/css'))
		.pipe(browserSync.reload({stream:true}));

});

gulp.task('scripts', function(){

	gulp.src('src/js/main.js')
		.pipe(browserify({
			transform: 'vueify',
			debug: true
		}))
		.on('error', onError)
		.pipe(rename('build.js'))
		// .pipe(uglify())
		.pipe(gulp.dest('./public/js'))
		.pipe(browserSync.reload({stream:true}));

});

gulp.task('build', function(){

	gulp.src('src/js/main.js')
		.pipe(browserify({
			transform: 'vueify',
			debug: true
		}))
		.on('error', onError)
		.pipe(rename('build.js'))
		.pipe(uglify())
		.on('error', onError)
		.pipe(gulp.dest('./public/js'))
		.pipe(browserSync.reload({stream:true}));

});

gulp.task('images', function(){

	gulp.src('src/assets/**/*.{jpg,jpeg,png,gif,svg}')
		.pipe(imagemin({
			optimizationLevel: 3,
			progessive: true,
			interlaced: true
	    }))
	    .pipe(gulp.dest('public/assets'))
	    .pipe(browserSync.reload({stream:true}));

});

gulp.task('html', function(){

	return gulp.src('public/**/*html')
		.pipe(strip())
		.pipe(browserSync.reload({stream:true}));

});


gulp.task('watch', function(){

	gulp.watch('public/**/*.html', ['html']);
	gulp.watch('src/**/*.scss', ['styles']);
	gulp.watch('src/**/*.{js,json,vue}', ['scripts']);
	gulp.watch('src/**/*.{jpg,jpeg,png,gif,svg}', ['images']);


});

function onError(err) {
  console.log(err.toString());
  this.emit('end');
}

gulp.task('default', ['html', 'scripts', 'images', 'styles', 'browserSync', 'watch']);