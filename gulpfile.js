const gulp =        require('gulp');
const plugins =     require('gulp-load-plugins')();

const requireDir =  require('require-dir');
const del =         require('del');

const tasks =       requireDir('./gulp-tasks');

//-=======================================================---
//------------------ Micro Tasks
//-=======================================================---

gulp.task('clean', done => {
	del([
		    '!public/.gitignore',    'public/*',      // compiled, static-served files
		    '!client/snapshots/.gitignore', 'client/snapshots/*',   // snapshots cacher
		    '!uploads/.gitignore',          'uploads/*'             // user uploads (images mainly)
	    ], done);
});

gulp.task('define-revision', () => {
	process.env.VERSIONSTR = process.env.SOURCE_VERSION ? '-' + process.env.SOURCE_VERSION.substr(0, 10) : '';
});

gulp.task('define-local', () => {
	process.env.LOCAL = true;
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

gulp.task('build', plugins.sequence(['font-awesome', 'polimap'], ['sass-to-css', 'jade-to-html'], 'construct-html-head', 'js'));

gulp.task('local', plugins.sequence(['define-local', 'build']));

gulp.task('heroku', ['define-revision', 'clean', 'build']);
