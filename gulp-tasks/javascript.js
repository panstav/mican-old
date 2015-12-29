const path = require('path');

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const webpack = require('webpack');
const StringReplacePlugin = require('string-replace-webpack-plugin');

const packageJson = require('../package.json');

module.exports.bundle = done => {

	const jsBundleFilename = `bundle${ process.env.VERSIONSTR || '' }.js`;

	// inject google analytics key to be used from client side
	const googleAnalyticsKey = {
		pattern: /ANALYTICS_KEY/,
		replacement: () => process.env.ANALYTICS_KEY
	};
	
	// about page showcases dependencies
	// fetch them from package.json, filter and inject
	const filteredPackageDependecies = {
		pattern: /PACKAGE\.JSON_FILTERED_DEPENDENCIES/,
		replacement: () => {

			const unwantedDeps = ['angular', 'passport', 'mongo', 'font-awesome', 'cloudinary', 'universal-analytics', 'mailchimp-api', 'mandrill-api', 'express', 'passport-facebook', 'passport-google-oauth', 'passport-strategy'];

			// get all deps, including devDeps
			// remove unwanted depencencies
			// and set titles and urls to direct to the npmjs.com package
			const filteredDeps = Object.keys(packageJson.dependencies).concat(Object.keys(packageJson.devDependencies))
				.filter(dep => unwantedDeps.indexOf(dep) === -1)
				.map(dep => ({ title: dep, url: `https://www.npmjs.com/package/${ dep }` }));

			return JSON.stringify(filteredDeps);
		}
	};

	const replacerOptions = StringReplacePlugin.replace(
		{ replacements: [ googleAnalyticsKey, filteredPackageDependecies ] }
	);

	var webpackOptions = {

		entry: './src/index.js',

		output: { path: './public', filename: jsBundleFilename },

		context: path.join(__dirname, '../client'),

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
				{ test: [/track\.js/, /about\.ctrl/], loader: replacerOptions }

			]
		}
	};

	// on a local machine - log webpack stats
	if (process.env.LOCAL){
		var StatsPlugin = require('stats-webpack-plugin');

		webpackOptions.plugins.push(new StatsPlugin('../../webpack-stats.json', {}));
	}

	webpack(webpackOptions, err => {
		if (err) throw new plugins.util.PluginError("webpack", err);

		const uglifier = process.env.NODE_ENV === 'production' ? plugins.uglify : plugins.util.noop;

		gulp.src(`public/${ jsBundleFilename }`)
			.pipe(uglifier())
			.pipe(gulp.dest('public/'));

		done();
	});

};