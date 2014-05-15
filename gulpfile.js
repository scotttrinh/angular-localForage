var gulp = require('gulp');

gulp.task('karma', function() {
	var karma = require('gulp-karma');
	var testFiles = [
		'bower_components/angular/angular.js',
		'bower_components/angular-mocks/angular-mocks.js',
		'bower_components/localforage/dist/localforage.min.js',
		'src/angular-localforage.js',
		'tests/angular-localForage.js'
	];
	return gulp.src(testFiles)
		.pipe(karma({
			configFile: 'karma.conf.js',
			action: 'run'
		}))
		.on('error', function(err) {
			// Make sure failed tests cause gulp to exit non-zero
			throw err;
		});
});

gulp.task('build', ['karma'], function() {
	var rename = require('gulp-rename'),
		uglify = require('gulp-uglify'),
		header = require('gulp-header'),
		pkg = require('./package.json'),
		banner = ['/**',
	              ' * <%= pkg.name %> - <%= pkg.description %>',
	              ' * @version v<%= pkg.version %>',
	              ' * @link <%= pkg.homepage %>',
	              ' * @license <%= pkg.license %>',
	              ' * @author <%= pkg.author %>',
	              ' */',
	              ''].join('\n');

	return gulp.src('src/angular-localForage.js')
		.pipe(header(banner, { pkg : pkg } ))
		.pipe(gulp.dest('dist'))
		.pipe(uglify())
		.pipe(header(banner, { pkg : pkg } ))
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist'));
});