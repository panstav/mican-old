'use strict';

var path = require('path');
var packageJson = require('./package.json');

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var webpack = require('webpack');
var StringReplacePlugin = require('string-replace-webpack-plugin');

var autoprefixer = require('autoprefixer');
var usefulString = require('useful-string');

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

gulp.task('font-awesome', () => {

	var fontAwesomeFiles = [
		'node_modules/font-awesome/css/*',
		'node_modules/font-awesome/fonts/*'
	];

	return gulp.src(fontAwesomeFiles)
		.pipe(plugins.copy('public/font-awesome/', { prefix: 2 }));

});

gulp.task('sass-to-css', () => {

	var sassOptions = process.env.LOCAL
		? { errLogToConsole: true, sourceComments : 'normal' }
		: { outputStyle: 'compressed' };

	var postcssOptions = [
		autoprefixer({ browsers: ['last 2 versions', '> 5%', 'ie > 8'] })
	];

	return gulp.src('client/src/index.sass')
		.pipe(plugins.sass(sassOptions))
		.pipe(plugins.rename({ basename: `global${ process.env.VERSIONSTR || '' }` }))
		.pipe(plugins.postcss(postcssOptions))
		.pipe(gulp.dest('public'));

});

gulp.task('jade-to-html', () => {

	var jadeOptions = process.env.LOCAL ? { pretty: true } : {};

	return gulp.src('client/src/**/*.jade')
		.pipe(plugins.data(jsonDataCollector))
		.pipe(plugins.jade(jadeOptions))
		.pipe(plugins.rename(partialsRenamer))
		.pipe(gulp.dest('public/partials'));

	function jsonDataCollector(file){
		var filename = path.basename(file.path, '.jade');

		if (filename !== 'index') return {};

		return require('./client/src/' + filename + '.json');
	}

	function partialsRenamer(path){

		// use hyphen-style instead of camelCase
		path.basename = usefulString.hyphenate(path.basename);

		// separate modals to a own folder
		path.dirname = path.dirname.indexOf('modal') > -1 ? 'modals' : '';

	}

});

gulp.task('construct-html-head', () => {

	var resources = buildResourcesObj();

	return gulp.src('public/partials/index.html')
		.pipe(plugins.htmlReplace(resources))
		.pipe(gulp.dest('public/partials'));

	function buildResourcesObj(){

		var resourcesObj = {};

		// insert the possibly versioned css file and the font-awesome loader
		resourcesObj.css = [
			`global${ process.env.VERSIONSTR || '' }.css`,
			`font-awesome/css/font-awesome${ process.env.NODE_ENV === 'production' ? '.min' : '' }.css`
		];

		// insert the possibly versioned js file as async script
		resourcesObj.js = {
			src: `bundle${ process.env.VERSIONSTR || '' }.js`,
			tpl: '<script async src="%s"></script>'
		};

		// insert noindex meta tag for non-production environments
		if (process.env.NODE_ENV !== 'production'){

			resourcesObj.noIndex = {
				src: null,
				tpl: '<meta name="robots" content="noindex">'
			};

			return resourcesObj;

		}

		// insert google verification
		resourcesObj.google = {
			src: null,
			tpl: `<meta name="google-site-verification" content="${ process.env.GOOGLE_VERIFICATION }">`
		};

		// insert bing verification
		resourcesObj.bing = {
			src: null,
			tpl: `<meta name="msvalidate.01" content="${ process.env.BING_VERIFICATION }" />`
		};

		// insert facebook verification
		resourcesObj.facebook = {
			src: null,
			tpl: `
				<meta property="fb:admins" content="${ process.env.FACEBOOK_ADMIN_ID }" />
				<meta property="fb:app_id" content="${ process.env.FACEBOOK_APP_ID }" />
			`
		};

		return resourcesObj;
	}

});

gulp.task('js', done => {

	var jsBundleFilename = `bundle${ process.env.VERSIONSTR || '' }.js`;

	var webpackOptions = getWebpackOptions();

	webpack(webpackOptions, err => {
		if (err) throw new plugins.util.PluginError('webpack', err);

		let uglifier = process.env.NODE_ENV === 'production' ? plugins.uglify : plugins.util.noop;

		gulp.src(`public/${ jsBundleFilename }`)
			.pipe(uglifier())
			.pipe(gulp.dest('public/'));

		done();
	});

	function getWebpackOptions(){

		// inject google analytics key to be used from client side
		let googleAnalyticsKey = {
			pattern: /ANALYTICS_KEY/,
			replacement: () => process.env.ANALYTICS_KEY
		};

		// inject facebook app id to be used from client side
		let facebookAppId = {
			pattern: /FACEBOOK_APP_ID/,
			replacement: () => process.env.FACEBOOK_APP_ID
		};

		// about page showcases dependencies
		// fetch them from package.json, filter and inject
		let filteredPackageDependecies = {
			pattern: /PACKAGE_JSON_FILTERED_DEPENDENCIES/,
			replacement: () => {

				let unwantedDeps = ['angular', 'passport', 'mongo', 'font-awesome', 'cloudinary', 'universal-analytics', 'mailchimp-api', 'mandrill-api', 'express', 'passport-facebook', 'passport-google-oauth', 'passport-strategy'];

				// get all deps, including devDeps
				// remove unwanted depencencies
				// and set titles and urls to direct to the npmjs.com package
				let filteredDeps = Object.keys(packageJson.dependencies).concat(Object.keys(packageJson.devDependencies))
					.filter(dep => unwantedDeps.indexOf(dep) === -1)
					.map(dep => ({ title: dep, url: `https://www.npmjs.com/package/${ dep }` }));

				return JSON.stringify(filteredDeps);
			}
		};

		var domainName = {
			pattern: /DOMAIN_NAME/,
			replacement: () => require('./common').domain
		};

		var replacerOptions = StringReplacePlugin.replace(
			{ replacements: [ googleAnalyticsKey, facebookAppId, filteredPackageDependecies, domainName ] }
		);

		var webpackOptions = {

			entry: './src/index.js',

			output: { path: './public', filename: jsBundleFilename },

			context: path.join(__dirname, 'client'),

			plugins: [
				new StringReplacePlugin()
			],

			module: {
				loaders: [

					// es2015 => inject(es5)
					{ test: /\.js$/, loader: 'babel', query: { presets: ['es2015'] }, exclude: /(node_modules|bower_components)/ },

					// jade => inject(html)
					{ test: /\.jade/, loader: 'html!jade-html' },

					// files with dynamic data => inject(data)
					{ test: /index\.js/, loader: replacerOptions }

				]
			}
		};

		// on a local machine - log webpack stats
		if (process.env.LOCAL && process.env.DEBUG){
			var StatsPlugin = require('stats-webpack-plugin');

			webpackOptions.plugins.push(new StatsPlugin('./webpack-stats.json', {}));
		}

		return webpackOptions;
	}

});

//-=======================================================---
//------------------ Build ENVs
//-=======================================================---

gulp.task('build', plugins.sequence('prep-public-dir', ['font-awesome', 'polimap'], ['sass-to-css', 'jade-to-html'], 'construct-html-head', 'js'));

gulp.task('local', plugins.sequence('clean', 'define-local', 'build'));

gulp.task('heroku', plugins.sequence('clean', 'define-revision', 'build'));

gulp.task('production-like', plugins.sequence('define-production', 'heroku'));
