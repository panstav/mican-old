const gulp =    require('gulp');
const plugins = require('gulp-load-plugins')();

const autoprefixer = require('autoprefixer');

module.exports.toCss = () => {

	const sassOptions = process.env.LOCAL
		? { errLogToConsole: true, sourceComments : 'normal' }
		: { outputStyle: 'compressed' };

	const postcssOptions = [
		autoprefixer({ browsers: ['last 2 versions', '> 5%', 'ie > 8'] })
	];

	return gulp.src('client/src/index.sass')
		.pipe(plugins.sass(sassOptions))
		.pipe(plugins.rename({ basename: `global${ process.env.VERSIONSTR || '' }` }))
		.pipe(plugins.postcss(postcssOptions))
		.pipe(gulp.dest('public'));

};

module.exports.fontAwesome = () => {

	const fontAwesomeFiles = [
		'node_modules/font-awesome/css/*',
		'node_modules/font-awesome/fonts/*'
	];

	return gulp.src(fontAwesomeFiles)
		.pipe(plugins.copy('public/font-awesome/', { prefix: 2 }));

};