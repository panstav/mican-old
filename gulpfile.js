'use strict';

var gulp =        require('gulp');
var plugins =     require('gulp-load-plugins')();

var requireDir =  require('require-dir');
var tasks =       requireDir('./gulp-tasks');

//-=======================================================---
//------------------ Micro Tasks
//-=======================================================---

gulp.task('clean', () => {

	let tempFiles = [
		'!public/.gitignore',           'public/*',             // compiled, static-served files
		'!client/snapshots/.gitignore', 'client/snapshots/*',   // snapshots cacher
		'!uploads/.gitignore',          'uploads/*'             // user uploads (images mainly)
	];

	return gulp.src(tempFiles, { read: false })
		.pipe(plugins.clean({ force: true }));

});

gulp.task('define-revision', () => {
	process.env.VERSIONSTR = process.env.SOURCE_VERSION ? '-' + process.env.SOURCE_VERSION.substr(0, 10) : '';
});

gulp.task('define-local', done => {
	process.env.LOCAL = true;

	require('./env');

	done();
});

gulp.task('define-production', done => {
	process.env.NODE_ENV = 'production';

	require('./env');

	done();
});

gulp.task('prep-public-dir', () => {

	let copyPaste = [
		'client/manifest.json',
	  'client/browserconfig.xml',
	  'client/sitemap.xml',
	  'client/robots.txt',
	  'client/alefhebrew.css'
	];

	return gulp.src(copyPaste)
		.pipe(gulp.dest('public'));

});

gulp.task('polimap', () => {
	return gulp.src('client/polimap/**')
			.pipe(plugins.copy('public/polimap', { prefix: 2 }));
});

gulp.task('nodemon', () => {
	plugins.nodemon(
			{
				script: 'server/server.js',
				ignore: ['node_modules/**'],
				env: {
					'LOCAL': true
				}
			}
	);
});

//-=======================================================---
//------------------ Build
//-=======================================================---

gulp.task('font-awesome', tasks.sass.fontAwesome);

gulp.task('sass-to-css', tasks.sass.toCss);

gulp.task('jade-to-html', tasks.jade.toHtml);

gulp.task('construct-html-head', tasks.jade.constructHead);

gulp.task('js', tasks.javascript.bundle);

//-=======================================================---
//------------------ Build ENVs
//-=======================================================---

gulp.task('build', plugins.sequence('prep-public-dir', ['font-awesome', 'polimap'], ['sass-to-css', 'jade-to-html'], 'construct-html-head', 'js'));

gulp.task('local', plugins.sequence('clean', 'define-local', 'build'));

gulp.task('heroku', plugins.sequence('clean', 'define-revision', 'build'));

gulp.task('production-like', plugins.sequence('define-production', 'heroku'));
